class Tool {
  constructor(id, name, category, description, condition) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.condition = condition;
    this.status = 'available';
  }

  isAvailable() {
    return this.status === 'available';
  }
}

const tools = [
  new Tool(1, 'Cordless Drill', 'Power Tools', '20V drill with two batteries and a bit set.', 'Good'),
  new Tool(2, 'Extension Ladder', 'Ladders', '24-foot aluminum extension ladder.', 'Good'),
  new Tool(3, 'Pressure Washer', 'Outdoor', '2000 PSI electric pressure washer.', 'Fair'),
  new Tool(4, 'Circular Saw', 'Power Tools', '7-1/4 inch circular saw with blade guard.', 'Good'),
  new Tool(5, 'Hedge Trimmer', 'Outdoor', 'Electric hedge trimmer with a 22-inch blade.', 'Good'),
  new Tool(6, 'Tile Cutter', 'Hand Tools', 'Manual tile cutter for tiles up to 24 inches.', 'Excellent')
];

function getAllTools() {
  return tools;
}

function getToolById(id) {
  return tools.find(t => t.id === id);
}

function getCategories() {
  return [...new Set(tools.map(t => t.category))];
}

function filterTools(category) {
  if (!category) return tools;
  return tools.filter(t => t.category === category);
}

module.exports = { Tool, getAllTools, getToolById, getCategories, filterTools };