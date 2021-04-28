import {
    Grid,
    Tooltip,
    InputLabel,
    FormControlLabel,
    Switch
} from '@material-ui/core';
import React, { useState } from 'react';

const Option = ({ global, setGlobal, setOpt, Type, tooltipDetails, options=false, setLocal, local, ...props }) => {
    const [useGlobal, setUseGlobal] = useState(true);
    const value = useGlobal ? global : local;
    const nextValue = useGlobal ? local : global;
    const setValue = useGlobal ? setGlobal : setLocal;

    const handleChange = event => {
        setOpt(event);
        setValue(event);
    }

    const { placement, title, aria_label, label, id } = tooltipDetails;

    return <Grid item>
        <Tooltip
            placement={ placement }
            title={ title }
            aria-label={ aria_label }>
            <InputLabel id={ id }>{ label }</InputLabel>
        </Tooltip>
        <Type
            value={ value }
            onChange={ handleChange }
            id={ id }
            { ...props }>
            {
                options && options.map(
                    ({ OptionType, value, label }) =>
                    <OptionType value={ value }>{ label }</OptionType>)
            }
        </Type>
        <FormControlLabel
            control={
            <Switch
                checked={useGlobal}
                onChange={() => {
                    setUseGlobal(prev => !prev)
                    setOpt({ target: { value: nextValue }});
                }}
                name="useGlobal"
                color="primary"
            />
            }
            label="Global"
      />
    </Grid>;
}

export default Option;