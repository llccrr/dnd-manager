/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';

const filter = createFilterOptions();

export default function ComboBox({ list = [], onCreate, ...props }) {
    const [value, setValue] = React.useState(null);
    return (
        <Autocomplete
            value={value}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Suggest the creation of a new value
                if (params.inputValue !== '') {
                    // onCreate();
                    filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={list}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.title;
            }}
            renderOption={(option) => (
                <Row>
                    <MonsterAvatar src={option.avatarUrl} /> {option.title}
                </Row>
            )}
            style={{ width: 300 }}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Monsters" variant="outlined" />}
            {...props}
        />
    );
}

const Row = styled.div`
    display: flex;
    align-items: center;
`;
const MonsterAvatar = styled(Avatar)`
    margin: 0 10px;
    width: 40px;
    height: 40px;
`;
