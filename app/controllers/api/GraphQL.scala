package controllers.api

import javax.inject.{Inject, Singleton}

import com.bowlingx.GraphQLContext
import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.mvc._
import sangria.parser.QueryParser

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

@Singleton
class GraphQL @Inject()(component: ControllerComponents, val extractorService: GraphQLContext)
                       (implicit context: ExecutionContext) extends AbstractController(component) with GraphQLSupport {

  def graphql : Action[JsValue] = Action.async(parse.json) { request ⇒
    val query = (request.body \ "query").as[String]
    val operation = (request.body \ "operationName").asOpt[String].filter(!_.isEmpty)
    val variables = (request.body \ "variables").toOption.map {
      case obj: JsObject => obj
      case _ => Json.obj()
    }.getOrElse(Json.obj())

    QueryParser.parse(query) match {
      case Success(queryAst) =>
        executeGraphQLQuery(queryAst, operation, variables)

      case Failure(error) =>
        Future.successful(BadRequest(Json.obj("error" → error.getMessage)))
    }
  }
}
