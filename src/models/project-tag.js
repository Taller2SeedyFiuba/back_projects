const { ProjectTag } = require("../database");


async function projectAddTags(projectid, tags){
  tags = tags.map(tag => {return { projectid, tag }})
  return await ProjectTag.bulkCreate(tags, { returning: true })
}

async function projectDeleteTags(projectid){
  return await ProjectTag.destroy({ where: { projectid } });
}

function getModel(){
  return ProjectTag;
}

module.exports = {
  projectAddTags,
  projectDeleteTags,
  getModel
}
