
const entities = {
    group: {
        name: 'group',
        path: 'groups',
        type: 'list',
        fields: [
            {
                desc: 'Group Name',
                type: 'string',
                fname: 'name',
            },
            {
                desc: 'Starting Date',
                type: 'date',
                fname: 'date',
                options: {format: 'dd/mm/yyyy'}
            },
            {
                desc: 'Meeting Hour',
                type: 'date',
                fname: 'time',
                options: {format: 'HH:MM'}
            },        
        ]
    },

    user: {
        name: 'user',
        path: '<%= group %>/users',
        type: 'list',
        fields: [
            {
                desc: 'User Name',
                type: 'string',
                fname: 'name',
            },
            {
                desc: 'Phone',
                type: 'string',
                fname: 'phone',
            }
        ]
    },

    weight: {
        name: 'weight',
        path: '<%= group %>/weights',
        type: 'list',
        fields: [
            {
                desc: 'week',
                type: 'number',
                fname: 'week'
            },
            {
                desc: 'User Name',
                type: 'ref',
                fname: 'nameKey',
                options: {
                    ref: 'user',
                }
            },
            {
                desc: 'weight',
                type: 'number',
                fname: 'weight',
            },
            {
                desc: 'status',
                type: 'list',
                fname: 'status',
                options: {
                    items: ['absent', 'vacation', 'won', 'lost', ],
                }
            }
        ]
    },

};



export default entities;