const Sequelize = require("sequelize");
const Joi = require("joi");


const Project = {}

//Enums
const type = ['software', 'electronics', 'art'];
const stage =  ['funding', 'finished', 'cancelled'];

Project.enums = { type, stage }

//Attributes

const attributes = {}

attributes.resume = ['id', 'ownerid', 'title'];
attributes.editable = ['title', 'description'];
attributes.private = []  //Agregar en caso de que sea necesario
attributes.public = [ 'ownerid',
                      'id',
                      'title', 
                      'description',
                      'type',
                      'stage',
                      'creationdate',
                      'finishdate',
                      'sponsorshipagreement',
                      'seeragreement' ]
attributes.publicPrivate = attributes.public.concat(attributes.private)

Project.attributes = attributes;

Project.model = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ownerid: {
    type: Sequelize.CHAR(255),
    allowNull: false,
  },
  title: {
    type: Sequelize.CHAR(80),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM(...Project.enums.type),
    allowNull: false,
  },
  location: {
    type: Sequelize.GEOMETRY,
    allowNull: false,
  },
  stage: {
    type: Sequelize.ENUM(...Project.enums.stage),
  },
  creationdate: {
    type: Sequelize.DATE,
  },
  finishdate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  sponsorshipagreement: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  seeragreement: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
}


Project.tagModel = {
  projectid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  tag: {
    type: Sequelize.CHAR(30),
    primaryKey: true,
  }
}


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
      tags: this.attSchema['tags'],
    }).options({ abortEarly: false });
    
    return JoiSchema.validate(project);
  }

module.exports = {
  Project
}
