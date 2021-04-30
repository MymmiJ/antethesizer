import React, { useState } from 'react';
import MenuItem from '@material-ui/core';

const CustomMenuItem = ({ defaultValue = '', Type = MenuItem, ...props }) => {
    const [value, setValue] = useState(defaultValue);
    return <Type value={ value } setValue={ setValue } {...props} />;
}