import DatePicker from 'react-multi-date-picker'
import dari_dr from "../../../constants/Dari_dr"
import persian from "react-date-object/calendars/persian"
import { useFormikContext } from "formik";

const CustomDatePicker = ({ name, value, onChange, placeholder = '', className, ...props }) => {


    return (
        <DatePicker
            value={value}
            onChange={onChange}
            calendar={persian}
            locale={dari_dr}
            className={className}
            name={name}
            placeholder={placeholder}
            {...props}

        />
    );
};

export default CustomDatePicker;
