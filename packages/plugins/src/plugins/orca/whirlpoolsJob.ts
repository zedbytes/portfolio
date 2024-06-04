import { Job } from '../../Job';
import { platformId, whirlpoolProgram } from './constants';
import getWhirlpoolsJob from './getWhirlpoolsJob';

const job: Job = {
  id: `${platformId}-whirlpools`,
  executor: getWhirlpoolsJob(whirlpoolProgram),
  label: 'normal',
};
export default job;
