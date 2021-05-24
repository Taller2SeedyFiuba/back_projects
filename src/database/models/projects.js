const Sequelize = require("sequelize");
const Joi = require("joi");

//Enums
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
  /*
  location: {
    type: Sequelize.GEOGRAPHY,
    allowNull: false,
  },*/
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

//Atributes
const resumeAtributes = ['id', 'title'];
const editableAtributes = ['title', 'description'];
const publicAtributes = [ 'ownerid',
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


//ProjectTagModel.belongsTo(ProjectModel, {foreignKey: 'projectid'})

class ProjectValidator{

  newProject(project){
    const JoiSchema = Joi.object({
      ownerid: Joi.string()
        .max(255)
        .required(),
      title: Joi.string()
        .min(5)
        .max(80)
        .required(),
      description: Joi.string()
        .min(5)
        .max(80)
        .required(),
      type: Joi.string()
        .required()
        .valid(...project_type_enum),
      finishdate: Joi.date()
        .required(),
      sponsorshipagreement: Joi.string()
        .min(5)
        .required(),
      seeragreement: Joi.string()
        .min(5)
        .required(),
      tags: Joi.array()
        .items(Joi.string().min(2).max(30))
        .unique()
    }).options({ abortEarly: false });
    
    return JoiSchema.validate(project);
  }

  editProjectPermissions(attributes, fullPermissions){
    if (fullPermissions) return true;
    Object.keys(attributes).forEach(at => {
      if (!editableAtributes.includes(at)) return false;
    })
  
    return true;

  }

  editProject(project){
    const JoiSchema = Joi.object({
      ownerid: Joi.string()
        .max(255),
      title: Joi.string()
        .min(5)
        .max(80),
      description: Joi.string()
        .min(5)
        .max(80),
      type: Joi.string()
        .valid(...project_type_enum),
      stage: Joi.string()
        .valid(...project_stage_enum),
      finishdate: Joi.date(),
      sponsorshipagreement: Joi.string()
        .min(5),
      seeragreement: Joi.string()
        .min(5),
      tags: Joi.array()
        .items(Joi.string().min(2).max(30))
        .unique()
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
  publicAtributes,
  editableAtributes,
  resumeAtributes
}
