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
  res.send({ statistics });
};

export const statistics_by_country_get = async (req: express.Request, res: express.Response) => {
  const countryId = req.params.countryId;
  const statistic = await Statistic.findOne({ country: countryId }).lean();

  if (!statistic) {
    res.status(403).json({
      message: `Record not found for country: ${countryId}`,
    });
  }

  res.send({ statistic });
};

export const sync_get = async (req: express.Request, res: express.Response) => {
  populateStatistics(true)
    .then(() => res.send({ sync: true }))
    .catch((err) => res.status(403).json({ message: err.message }));
};
