package controllers

import javax.inject._

import com.bowlingx.{Engine, GraphQLContext}
import controllers.api.GraphQLSupport
import jdk.nashorn.api.scripting.ScriptObjectMirror
import play.api.mvc._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}


@Singleton
class HomeController @Inject()
(@Named("server") engine: Engine, component: ControllerComponents, val extractorService: GraphQLContext)
(implicit context: ExecutionContext) extends AbstractController(component) with GraphQLSupport {

  def index(path:String): Action[AnyContent] = Action.async { request =>
    engine.render("render", createQueryExecutor, request.path).map {
      case Success(Some(renderResult: ScriptObjectMirror)) =>

        val content = renderResult.get("content").toString
        val initialState = renderResult.get("initialState").toString

        Ok(views.html.index(content, initialState))
      case Failure(ex) => Ok(views.html.index(ex.getMessage, ""))
      case _ => NotFound
    }
  }
}

