import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import 'antd/lib/date-picker/style/index';

const DatePicker = generatePicker(dateFnsGenerateConfig);

export default DatePicker;
