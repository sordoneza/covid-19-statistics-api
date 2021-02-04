import express from 'express';
import axios from 'axios';
import Statistic from '../models/Statistic';
import { STATISTICS_ENDPOINT } from '../constants/endpoint';

//Fetch Data from RAPID API
const fetchInitData = async () => {
  const apiEndpoint = `https://${process.env.COVID_API_HOST}${STATISTICS_ENDPOINT}`;
  const apiKey = process.env.COVID_API_KEY;

  const { data } = await axios.get(apiEndpoint, {
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': process.env.COVID_API_HOST,
    },
  });

  return data;
};

export const populateStatistics = async (resetData: boolean = false) => {
  if (resetData) {
    await Statistic.deleteMany();
  } else {
    const statistics = await Statistic.findOne();
    // Data exists, no need to populate.
    if (statistics) {
      return;
    }
  }

  try {
    // Fetch data from RAPID API
    const data = await fetchInitData();

    // Iterate through each record
    Object.values(data.response).forEach((stat: any) => {
      const {
        continent,
        country,
        population,
        cases: { new: newers, active, critical, recovered, '1M_pop': M_POP, total },
        deaths: { new: newers_death, '1M_pop': M_POP_death, total: total_death },
        tests: { '1M_pop': M_POP_test, total: total_test },
        time,
      } = stat;

      // create Statistic Object
      const newStat = {
        continent,
        country,
        population,
        cases: { newers: +newers, active, critical, recovered, M_POP: +M_POP, total },
        deaths: { newers: +newers_death, M_POP: +M_POP_death, total: +total_death },
        tests: { M_POP: +M_POP_test, total: +total_test },
        day: time,
      };

      //Persist Statistic Object
      Statistic.create(newStat);
    });
  } catch (err) {
    console.log(err.message);
    throw new Error('Unable to retrieve data from API');
  }
};

export const statistics_get = async (req: express.Request, res: express.Response) => {
  const statistics = await Statistic.find().lean();
  res.send([...statistics]);
};

export const statistics_by_country_get = async (req: express.Request, res: express.Response) => {
  const countryId = req.params.countryId;

  // Find Statistic record by country
  const statistic = await Statistic.findOne({
    country: { $regex: new RegExp(countryId, 'i') },
  }).lean();

  if (!statistic)
    return res.status(404).json({
      message: `Record not found for country: ${countryId}`,
    });

  res.send({ ...statistic });
};

export const statistics_put = async (req: express.Request, res: express.Response) => {
  const {
    statisticId,
    cases: { newCases = 0, critical = 0, active = 0, recovered = 0 },
    deaths: { newDeaths = 0 },
    tests: { newTests = 0 },
  } = req.body;

  try {
    // Search Statistic record by Id
    const statistic = await Statistic.findOne({ _id: statisticId }).lean();

    // Validate if record were found
    if (!statistic)
      return res.status(404).json({
        message: `Record not found for id: ${statisticId}`,
      });

    // Constant for Calcualte 1M_POP
    const MILLION = 1_000_000;

    // Get current values for cases, tests, deaths
    let { cases, tests, deaths } = statistic;

    // Calculate new values for cases
    if (newCases || critical || active || recovered) {
      const totalCases = cases.total + newCases + critical + active + recovered;
      const M_POP = Math.round((totalCases / statistic.population) * MILLION);
      cases = Object.assign({}, cases, {
        newers: cases.newers + newCases,
        active: cases.active + active,
        critical: cases.critical + critical,
        recovered: cases.recovered + recovered,
        M_POP: M_POP,
        total: totalCases,
      });
    }

    // Calculate new values for deaths
    if (newDeaths) {
      const totalDeaths = deaths.total + newDeaths;
      const M_POP = Math.round((totalDeaths / statistic.population) * MILLION);
      deaths = Object.assign({}, deaths, {
        newers: deaths.newers + newDeaths,
        M_POP: M_POP,
        total: totalDeaths,
      });
    }

    // Calculate new values for Tests
    if (newTests) {
      const totalTests = tests.total + newTests;
      const M_POP = Math.round((totalTests / statistic.population) * MILLION);
      tests = Object.assign({}, tests, {
        M_POP: M_POP,
        total: totalTests,
      });
    }

    // Update Statistic record on db
    await Statistic.updateOne({ _id: statisticId }, { cases, deaths, tests });

    // Retrieve updated record
    const updatedStatistic = await Statistic.findOne({ _id: statisticId }).lean();

    return res.json({ ...updatedStatistic });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

export const sync_get = async (req: express.Request, res: express.Response) => {
  populateStatistics(true)
    .then(() => res.send({ sync: true }))
    .catch((err) => res.status(404).json({ error: err.message }));
};
