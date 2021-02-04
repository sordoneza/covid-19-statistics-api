import mongoose, { Schema, Model, Document } from 'mongoose';

interface Cases extends Document {
  newers: number;
  active: number;
  critical: number;
  recovered: number;
  M_POP: number;
  total: number;
}

interface Deaths extends Document {
  newers: number;
  M_POP: number;
  total: number;
}

interface Tests extends Document {
  M_POP: number;
  total: number;
}

export interface IStatistics extends Document {
  continent: string;
  country: string;
  population: number;
  cases: Cases;
  deaths: Deaths;
  tests: Tests;
  day: Date;
}

const statisticSchema: Schema = new Schema(
  {
    continent: String,
    country: {
      type: String,
      required: true,
    },
    population: Number,
    cases: {
      newers: Number,
      active: Number,
      critical: Number,
      recovered: Number,
      M_POP: Number,
      total: Number,
    },
    deaths: {
      newers: Number,
      M_POP: Number,
      total: Number,
    },
    tests: {
      M_POP: Number,
      total: Number,
    },
    day: Date,
  },
  { timestamps: true }
);

const Statistic: Model<IStatistics> = mongoose.model<IStatistics>('statistic', statisticSchema);

export default Statistic;
