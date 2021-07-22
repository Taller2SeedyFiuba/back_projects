const Joi = require("joi");
const { BigNumber } = require('bignumber.js');
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
Project.attSchema['tags'] = Joi.array().items(Joi.string().min(2).max(30)).unique()
Project.attSchema['multimedia'] = Joi.array().items(Joi.string().min(2).max(255))
Project.attSchema['fundedamount'] = Joi.number()
Project.attSchema['sponsorscount'] = Joi.number().integer()
Project.attSchema['favouritescount'] = Joi.number().integer()
Project.attSchema['actualstage'] = Joi.number().integer()
Project.attSchema['location'] = Joi.object({
  'description': Joi.string().min(3).max(80),
  'lat': Joi.number().required(),
  'lng': Joi.number().required()
})
Project.attSchema['stages'] = Joi.array().items(Joi.object({
  'title': Joi.string().min(3).max(40),
  'description': Joi.string().min(3).max(255),
  'amount': Joi.number().positive().max(99999).required()
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
    actualstage: this.attSchema['actualstage'],
    missingamount: this.attSchema['fundedamount'],
    state: this.attSchema['state'],
    sponsorscount: Joi.number().integer().valid(-1, 1),  //It can only be incremented by one
    favouritescount: Joi.number().integer().valid(-1, 1)
  }).options({ abortEarly: false });

  const validation = JoiSchema.validate(newData);
  if (validation.error) return validation;

  newData.sponsorscount = newData.sponsorscount && newData.sponsorscount + project.sponsorscount
  newData.favouritescount = newData.favouritescount && newData.favouritescount + project.favouritescount

  if (newData.missingamount){
    const missing = new BigNumber(newData.missingamount)
    const total = new BigNumber(project.totalamount)
    newData.fundedamount = total.minus(missing).toNumber()
    if (missing.gt(total) || missing.lt(0)){
      return { error: { message: "wrong-missingamount"}};
    }
  }

  if (project.stages.length < newData.actualstage){
    return { error: { message: "wrong-actualstage"}};
  }

  if (newData.sponsorscount < 0){
    return { error: { message: "wrong-sponsorscount" }};
  }
  if (newData.favouritescount < 0){
    return { error: { message: "wrong-favouritescount" }};
  }

  delete newData['missingamount']

  return { data: newData }
}

Project.validateSearch = function (parameters){

  const locationSchema = Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
    dist: Joi.number().required()
  }).options({ abortEarly: false });

  const filterSchema = Joi.object({
    id: Joi.array().items(Project.attSchema['id']),
    ownerid: Project.attSchema['ownerid'],
    state: Project.attSchema['state'],
    type: Project.attSchema['type'],
    tags: Project.attSchema['tags'],
    location: locationSchema
  }).options({ abortEarly: false });

  const querySchema = Joi.object({
    filters: filterSchema,
    limit: Joi.number().integer().positive(),
    page: Joi.number().integer().positive()
  }).options({ abortEarly: false });

  return querySchema.validate(parameters);
}

Project.validateMetrics = function (data) {
  const JoiSchema = Joi.object({
    timeinterval: Joi.string().equal(...['month', 'week', 'day', 'hour', 'minute', 'second']),
    fromdate: Joi.date(),
    todate: Joi.date(),
    limit: Joi.number().positive()
  }).options({ abortEarly: false });

  return JoiSchema.validate(data);
}


module.exports = Project
