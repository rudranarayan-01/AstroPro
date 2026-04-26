export const calculateVastuScore = (rooms) => {
    // rooms = [{ type: 'Kitchen', direction: 'SE' }, { type: 'Bedroom', direction: 'SW' }]
    
    const rules = {
        'Kitchen': 'SE',
        'MasterBedroom': 'SW',
        'Entrance': 'N',
        'PoojaRoom': 'NE'
    };

    let score = 100;
    let suggestions = [];

    rooms.forEach(room => {
        if (rules[room.type] && rules[room.type] !== room.direction) {
            score -= 15;
            suggestions.push(`Move ${room.type} from ${room.direction} to ${rules[room.type]}`);
        }
    });

    return { score, suggestions };
};