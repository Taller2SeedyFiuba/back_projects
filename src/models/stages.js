const { Stages } = require("../database");


async function projectAddStages(projectid, stages){
  let position = 0;
  stages = stages.map(function ({title, description, amount}) {
    position += 1;
    return { projectid, position, title, description, amount }
  })
  return await Stages.bulkCreate(stages, { returning: true })
}

async function projectDeleteStages(projectid){
  return await Stages.destroy({ where: { projectid } });
}

function getModel(){
  return Stages;
}

module.exports = {
  projectAddStages,
  projectDeleteStages,
  getModel
}
