import axios from 'axios';
import axiosClient from './baseAxiosClient';
import { rootPaths, subPaths, statisticsType } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';

const { showResponseMessage } = formattedResponse;

const getStatisticsOverview = async () =>
  await axiosClient
    .getRequest([rootPaths.statistics, subPaths.overview])
    .then((res) => showResponseMessage(res));

const getStatisticsDetail = async (type) =>
  await axiosClient
    .getRequest([rootPaths.statistics, statisticsType[type]])
    .then((res) => showResponseMessage(res));

const getWorld = async () =>
  await axios.get('https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json');

export default {
  getStatisticsOverview,
  getStatisticsDetail,
  getWorld,
};
