import * as dayjs from 'dayjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import localizedFormat = require('dayjs/plugin/localizedFormat');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export { dayjs };
