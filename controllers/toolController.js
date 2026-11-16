const toolService = require('../services/toolService');

function showCatalog(req, res) {
  const category = req.query.category || '';
  res.render('tools', {
    title: 'Tool Catalog',
    tools: toolService.filterTools(category),
    categories: toolService.getCategories(),
    selectedCategory: category
  });
}

module.exports = { showCatalog };