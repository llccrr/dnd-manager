import React from 'react';
import uuid from 'react-uuid';
import { DataGrid } from '@material-ui/data-grid';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';

const columns = ({ onGameIdChange, onMonsterAvatarChange, onAdd }) => [
    {
        field: '',
        headerName: '',
        width: 70,
        renderCell: (params) => {
            return (
                <strong>
                    <button style={{ width: '50px' }} onClick={onAdd(params.row)}>
                        Add
                    </button>
                </strong>
            );
        },
    },
    {
        field: 'gameId',
        headerName: 'Game ID',
        width: 120,
        renderCell: (params) => {
            return (
                <strong>
                    <input
                        style={{ width: '50px' }}
                        onChange={onGameIdChange(params.rowIndex)}
                        value={params.row.gameId || '-'}
                    />
                </strong>
            );
        },
    },
    {
        field: 'avatarImage',
        headerName: 'Avatar',
        description: '',
        width: 100,
        renderCell: (params) => {
            console.log('params', params);
            return (
                <strong>
                    <MonsterAvatar alt="pour les aveugles" src={params.row.avatarUrl} />
                </strong>
            );
        },
    },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'hpMax', headerName: 'HP Max', width: 110 },
    { field: 'hpMin', headerName: 'HP Min', width: 100 },
    {
        field: 'remainingHp',
        headerName: 'HP',
        type: 'number',
        width: 80,
        isCellEditable: true,
    },
    {
        field: 'damageReceived',
        headerName: 'Damage Received',
        width: 170,
    },
    {
        field: 'acMax',
        headerName: 'AC Max',
        description: 'Armor + Bonus',
        width: 130,
    },
    {
        field: 'acMin',
        headerName: 'AC Min',
        description: 'Armor + Bonus',
        width: 130,
    },
    {
        field: 'hpState',
        headerName: 'HP State',
        description: 'Green | Orange | Red',
        width: 130,
        renderCell: (params) => {
            return <span style={{ color: params.row.hpState }}>{params.row.hpState}</span>;
        },
    },

    {
        field: 'avatarUrl',
        headerName: 'Avatar',
        description: '',
        width: 200,
        renderCell: (params) => {
            console.log('params', params);
            return (
                <strong>
                    <input
                        style={{ width: '50px' }}
                        onChange={onMonsterAvatarChange(params.row.monsterId)}
                        value={params.row.avatarUrl || '-'}
                    />
                </strong>
            );
        },
    },
];

export const CurrentBoard = ({ board = {}, updateGameId, onSelectedChange, onMonsterAvatarChange }) => {
    const formatMonsters = board?.monsters?.map((monster) => ({
        gameId: monster.gameId,
        ...monster,
        remainingHp: monster.hpMax ? monster.hpMax - monster.damageReceived : null,
        id: uuid(),
    }));

    if (!formatMonsters?.length) return <span>No Game initiate</span>;
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                isCellEditable={true}
                rows={formatMonsters}
                columns={columns({
                    onGameIdChange: updateGameId,
                    onAdd: onSelectedChange,
                    onMonsterAvatarChange: onMonsterAvatarChange,
                })}
                pageSize={10}
            />
        </div>
    );
};

const MonsterAvatar = styled(Avatar)`
    margin: 0 10px;
    width: 50px;
    height: 50px;
`;
