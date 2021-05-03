import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';

const HpColors = {
    green: '#4caf50',
    orange: '#ff9800',
    red: '#2196f3',
};
const columns = ({ onInitiativeChange, onMonsterAvatarChange, onAdd, duplicates }) => [
    {
        field: '',
        headerName: '',
        width: 70,
        renderCell: (params) => {
            return (
                <strong>
                    <button
                        style={{ width: '40px', height: '40px', fontSize: '30px', cursor: 'pointer', marginTop: 10 }}
                        onClick={onAdd(params.row)}
                    >
                        +
                    </button>
                </strong>
            );
        },
    },
    {
        field: 'monsterInitiative',
        headerName: 'Init',
        width: 80,
        renderCell: (params) => {
            return (
                <strong>
                    {duplicates.includes(params.row.monsterId) && (
                        <input
                            style={{ width: '50px' }}
                            onChange={onInitiativeChange(params.rowIndex)}
                            value={params.row.monsterInitiative || '-'}
                        />
                    )}
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
        renderCell: (params) => {
            return <span style={{ color: HpColors[params.row.hpState] }}>{params.row.remainingHp}</span>;
        },
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
            return <span style={{ color: HpColors[params.row.hpState] }}>{params.row.hpState}</span>;
        },
    },

    {
        field: 'avatarUrl',
        headerName: 'Avatar',
        description: '',
        width: 200,
        renderCell: (params) => {
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

export const CurrentBoard = ({ board = {}, updateMonsterInitiative, onSelectedChange, onMonsterAvatarChange }) => {
    const formatMonsters = board?.monsters?.map((monster) => ({
        gameId: monster.gameId,
        ...monster,
        remainingHp: monster.hpMax ? monster.hpMax - monster.damageReceived : null,
    }));

    if (!formatMonsters?.length) return <span>No Game initiate</span>;
    const monstersIds = formatMonsters.map((it) => it.monsterId);
    const duplicates = [...new Set(monstersIds.filter((monster, index) => monstersIds.indexOf(monster) !== index))];
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                isCellEditable={true}
                rows={formatMonsters}
                columns={columns({
                    duplicates,
                    onInitiativeChange: updateMonsterInitiative,
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
