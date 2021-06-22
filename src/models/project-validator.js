const Joi = require("joi");
const { Project: ProjectModel } = require("../database/index");

Project = {
  attSchema: {}
}
Project.attSchema['id'] = Joi.number().integer()
Project.attSchema['ownerid'] = Joi.string().max(255)
Project.attSchema['title'] = Joi.string().min(5).max(80)
Project.attSchema['description'] = Joi.string().min(5)
Project.attSchema['type'] = Joi.string().valid(...ProjectModel.enums.type)
Project.attSchema['state'] = Joi.string().valid(...ProjectModel.enums.state)
Project.attSchema['tags'] = Joi.array().items(Joi.string().min(2).max(30))
Project.attSchema['multimedia'] = Joi.array().items(Joi.string().min(2).max(255))
Project.attSchema['fundedamount'] = Joi.number().integer(),
Project.attSchema['sponsorscount'] = Joi.number().integer()
Project.attSchema['favouritescount'] = Joi.number().integer()
Project.attSchema['actualstage'] = Joi.number().integer()
Project.attSchema['location'] = Joi.object({
  'description': Joi.string().min(3).max(80),
  'lat': Joi.number().required(),
  'lng': Joi.number().required()
})
Project.attSchema['stages'] = Joi.array().items(Joi.object({
  'title': Joi.string().min(3).max(80),
  'description': Joi.string().min(3).max(255),
  'amount': Joi.number().required()
})).min(1).unique()


Project.validateNew = function (project){

  const JoiSchema = Joi.object({
    ownerid: this.attSchema['ownerid'].required(),
    title: this.attSchema['title'].required(),
    description: this.attSchema['description'].required(),
    type: this.attSchema['type'].required(),
    location: this.attSchema['location'].required(),
    multimedia: this.attSchema['multimedia'],
    tags: this.attSchema['tags'],
    stages: this.attSchema['stages'].required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(project);
}

Project.validateAndFormatEdition = function (project, newData){
  const JoiSchema = Joi.object({
    description: this.attSchema['description'],
    actualstage: Joi.number().integer().equal(1),
    fundedamount: this.attSchema['fundedamount'],
    sponsorscount: Joi.number().integer().valid(-1, 1),  //It can only be incremented by one
    favouritescount: Joi.number().integer().valid(-1, 1)
  }).options({ abortEarly: false });

  const validation = JoiSchema.validate(newData);
  if (validation.error) return validation;

  newData.actualstage = newData.actualstage && newData.actualstage + project.actualstage
  newData.fundedamount = newData.fundedamount && newData.fundedamount + project.fundedamount
  newData.sponsorscount = newData.sponsorscount && newData.sponsorscount + project.sponsorscount
  newData.favouritescount = newData.favouritescount && newData.favouritescount + project.favouritescount

  if (project.stages.length <= newData.actualstage){
    return { error: { message: "Wrong value for actualstage"}};
  }
  if (newData.fundedamount > project.totalamount || newData.fundedamount < 0){
    return { error: { message: "Wrong value for fundedamount"}};
  }
  if (newData.sponsorscount < 0){
    return { error: { message: "Wrong value for sponsorscount" }};
  }
  if (newData.favouritescount < 0){
    return { error: { message: "Wrong value for favouritescount" }};
  }

  return { data: newData }
}

module.exports = Project
