package controllers.api

import com.bowlingx.GraphQLContext
import jdk.nashorn.api.scripting.JSObject
import play.api.libs.json.{JsObject, Json}
import play.api.mvc.{AbstractController, Result}
import sangria.ast.Document
import sangria.execution.ExecutionScheme.Default.{Result => SangriaResult}
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.playJson.PlayJsonResultMarshaller.Node
import sangria.parser.QueryParser
import sangria.schema.Schema

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

trait GraphQLSupport {
  self: AbstractController =>

  val extractorService: GraphQLContext

  import sangria.marshalling.playJson._
  import com.bowlingx.schema._

  implicit def executeQueryMapToResult
  (result: SangriaResult[GraphQLContext, Node])(implicit ec: ExecutionContext): Future[Result] = {
    result
      .map(Ok(_))
      .recover {
        case error: QueryAnalysisError => BadRequest(error.resolveError)
        case error: ErrorWithResolver => InternalServerError(error.resolveError)
      }
  }

  def executeGraphQLQuery
  (query: Document, op: Option[String], vars: JsObject)
  (implicit ec: ExecutionContext): SangriaResult[GraphQLContext, Node] = {
    val schema = Schema(QueryType)

    Executor.execute(schema, query, extractorService, operationName = op, variables = vars)
  }

  implicit def executeQueryMapToString(result: SangriaResult[GraphQLContext, Node])
                                      (implicit ec: ExecutionContext): Future[String] = {
    result map (_.toString())
  }


  def createQueryExecutor(implicit ec: ExecutionContext): (String, String, String, JSObject, JSObject) => Unit =
    (query: String, variables: String, operationName: String, successCallback: JSObject, errorCallback: JSObject) => {
      val parsedVariables = Json.parse(variables) match {
        case obj: JsObject => obj
        case _ => Json.obj()
      }
      // FIXME: write something that converts a JSObject to a play-json object so we don't need to convert it to a string
      QueryParser.parse(query) match {
        case Success(queryAst) =>
          executeGraphQLQuery(queryAst, Option(operationName), parsedVariables).map(r => {
            successCallback.call(null, r.toString()) // scalastyle:ignore
          }).recover {
            case error: QueryAnalysisError => errorCallback.call(null, Json.stringify(error.resolveError)) // scalastyle:ignore
            case error: ErrorWithResolver => errorCallback.call(null, Json.stringify(error.resolveError)) // scalastyle:ignore
          }

        case Failure(error) =>
          errorCallback.call(null, Json.stringify(Json.obj("error" -> error.getMessage))) // scalastyle:ignore
      }
      ()
    }
}
