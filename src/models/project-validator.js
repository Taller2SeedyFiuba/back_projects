const Joi = require("joi");

const Project = {}

//Enums
const type = ['software', 'electronics', 'art'];
const stage =  ['funding', 'finished', 'cancelled'];

Project.enums = { type, stage }

//Attributes
const attributes = {}

attributes.resume = ['id', 'ownerid', 'title'];
attributes.public = [ 'ownerid',
                      'id',
                      'title', 
                      'description',
                      'type',
                      'stage',
                      'creationdate',
                      'finishdate',
                      'sponsorshipagreement',
                      'seeragreement',
                      'location' ]

Project.attributes = attributes;

Project.attSchema = {}
Project.attSchema['id'] = Joi.number().integer()
Project.attSchema['ownerid'] = Joi.string().max(255)
Project.attSchema['title'] = Joi.string().min(5).max(80)
Project.attSchema['description'] = Joi.string().min(5)
Project.attSchema['type'] = Joi.string().valid(...Project.enums.type)
Project.attSchema['stage'] = Joi.string().valid(...Project.enums.stage)
Project.attSchema['finishdate'] = Joi.date()
Project.attSchema['sponsorshipagreement'] = Joi.string().min(5)
Project.attSchema['seeragreement'] = Joi.string().min(5)
Project.attSchema['tags'] = Joi.array().items(Joi.string().min(2).max(30))
Project.attSchema['multimedia'] = Joi.array().items(Joi.string().min(2).max(255))
Project.attSchema['location'] = Joi.object({
  'lat': Joi.number().required(),
  'lng': Joi.number().required()
})


Project.validateNew = function (project){

  const JoiSchema = Joi.object({
    ownerid: this.attSchema['ownerid'].required(),
    title: this.attSchema['title'].required(),
    description: this.attSchema['description'].required(),
    type: this.attSchema['type'].required(),
    finishdate: this.attSchema['finishdate'].required(),
    sponsorshipagreement: this.attSchema['sponsorshipagreement'].required(),
    seeragreement: this.attSchema['seeragreement'].required(),
    location: this.attSchema['location'].required(),
    multimedia: this.attSchema['multimedia'],
    tags: this.attSchema['tags']
  }).options({ abortEarly: false });
  
  return JoiSchema.validate(project);
}

Project.validateEditionPermissions = function (attributes, fullPermissions){

  if (fullPermissions) return true;
  Object.keys(attributes).forEach(at => {
    if (!this.attributes.editable.includes(at)) return false;
  })
 
  return true;
}

Project.validateEdition = function (project){
  const JoiSchema = Joi.object({
    ownerid: this.attSchema['ownerid'],
    title: this.attSchema['title'],
    description: this.attSchema['description'],
    type: this.attSchema['type'],
    stage: this.attSchema['stage'],
    finishdate: this.attSchema['finishdate'],
    sponsorshipagreement: this.attSchema['sponsorshipagreement'],
    seeragreement: this.attSchema['seeragreement'],
    multimedia: this.attSchema['multimedia'],
    tags: this.attSchema['tags'],
  }).options({ abortEarly: false });
  
  return JoiSchema.validate(project);
}

module.exports = Project
