const { Multimedia } = require("../database");


async function projectAddMultimedia(projectid, multimedia){
  //let newMultimedia = [];
  //let pos = 1;
  //multimedia.forEach(url => {
  //  newMultimedia.push({ projectid, position: pos, url })
  //  pos += 1;
  //})
  let position = 0;
  multimedia = multimedia.map(function (url) {
    position += 1;
    return { projectid, position, url }
  })
  return await Multimedia.bulkCreate(multimedia, { returning: true })
}

async function projectDeleteMultimedia(projectid){
  return await Multimedia.destroy({ where: { projectid } });
}

function getModel(){
  return Multimedia;
}

module.exports = {
  projectAddMultimedia,
  projectDeleteMultimedia,
  getModel
}
