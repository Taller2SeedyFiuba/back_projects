const Sequelize = require("sequelize");
const Joi = require("joi");

//Enums PASAR A LOWERCASE
const project_type_enum = ['Software', 'Electronics', 'Art'];
const project_stage_enum =  ['Funding', 'Finished', 'Cancelled'];

const ProjectModel = {
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
    type: Sequelize.ENUM(...project_stage_enum),
    allowNull: false,
  },
  location: {
    type: Sequelize.GEOMETRY,
    allowNull: false,
  },
  stage: {
    type: Sequelize.ENUM(...project_stage_enum), //TODO: Tiene que ser un tipo categorico custom, quizas ENUM
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

//Attributes
const resumeAttributes = ['id', 'ownerid', 'title'];
const editableAttributes = ['title', 'description'];
const publicAttributes = [ 'ownerid',
                          'id',
                          'title', 
                          'description',
                          'type',
                          //'location',
                          'stage',
                          'finishdate',
                          'sponsorshipagreement',
                          'seeragreement' ]

const ProjectTagModel = {
  projectid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  tag: {
    type: Sequelize.CHAR(30),
    primaryKey: true,
  }
}


class ProjectValidator{

  constructor(){
    this.att = []
    this.att['id'] = Joi.number().integer()
    this.att['ownerid'] = Joi.string().max(255)
    this.att['title'] = Joi.string().min(5).max(80)
    this.att['description'] = Joi.string().min(5)
    this.att['type'] = Joi.string().valid(...project_type_enum)
    this.att['stage'] = Joi.string().valid(...project_stage_enum)
    this.att['finishdate'] = Joi.date()
    this.att['sponsorshipagreement'] = Joi.string().min(5)
    this.att['seeragreement'] = Joi.string().min(5)
    this.att['tags'] = Joi.array().items(Joi.string().min(2).max(30))
  }

  newProject(project){
    const JoiSchema = Joi.object({
      ownerid: this.att['ownerid'].required(),
      title: this.att['title'].required(),
      description: this.att['description'].required(),
      type: this.att['type'].required(),
      finishdate: this.att['finishdate'].required(),
      sponsorshipagreement: this.att['sponsorshipagreement'].required(),
      seeragreement: this.att['seeragreement'].required(),
      tags: this.att['tags']
    }).options({ abortEarly: false });
    
    return JoiSchema.validate(project);
  }

  editProjectPermissions(attributes, fullPermissions){
    if (fullPermissions) return true;
    Object.keys(attributes).forEach(at => {
      if (!editableAttributes.includes(at)) return false;
    })
  
    return true;

  }

  editProject(project){
    const JoiSchema = Joi.object({
      ownerid: this.att['ownerid'],
      title: this.att['title'],
      description: this.att['description'],
      type: this.att['type'],
      stage: this.att['stage'],
      finishdate: this.att['finishdate'],
      sponsorshipagreement: this.att['sponsorshipagreement'],
      seeragreement: this.att['seeragreement'],
      tags: this.att['tags'],
    }).options({ abortEarly: false });
    
    return JoiSchema.validate(project);
  }

  validateQueryParameters(parameters){
    const validParameters = ['lat', 'lng', 'dist', 'stage', 'type', 'hashtag'];
    const { lng,
            lat,
            dist,
            stage,
            type } = parameters;
    Object.keys(parameters).forEach(param => {
      if (!validParameters.includes(param)) return { error: Error("Wrong filter parameters") }
    })
    if (lng | lat | dist){
      if (!(lng && lat && dist)){
        return { error: Error("Geographical search requires latitude longitude and distance query parameters") }
      }
    }
    if (stage){
      if (!project_stage_enum.includes(stage)) return { error: Error("Wrong value in 'stage' query parameter") }
    }
    if (type){
      if (!project_type_enum.includes(type)) return { error: Error("Wrong value in 'type' query parameter") }
    }

    return { parameters }
  }

}

module.exports = {
  ProjectModel,
  ProjectTagModel,
  ProjectValidator,
  publicAttributes,
  editableAttributes,
  resumeAttributes
}
