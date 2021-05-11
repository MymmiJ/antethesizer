import {
    Grid,
    Tooltip,
    InputLabel,
    FormControlLabel,
    Switch
} from '@material-ui/core';
import React from 'react';

const Option = ({
    global, setGlobal,
    useGlobal, setUseGlobal,
    setLocal, local,
    setOpt,
    Type, tooltipDetails, options=false,
    ...props }) => {
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
                    <OptionType key={ value } value={ value }>{ label }</OptionType>)
            }
        </Type>
        <FormControlLabel
            control={
            <Switch
                checked={useGlobal}
                onChange={setUseGlobal(nextValue, !useGlobal)}
                name="useGlobal"
                color="primary"
            />
            }
            label="Global"
      />
    </Grid>;
}

export default Option;