package com.bowlingx

import sangria.schema._

case class ProgrammingLanguage(name: String)

class GraphQLContext {

  def getExampleData: List[ProgrammingLanguage] = {
    ProgrammingLanguage("Scala") ::
      ProgrammingLanguage("PHP") ::
      ProgrammingLanguage("JavaScript") ::
      ProgrammingLanguage("C++") :: Nil
  }
}

package object schema {

  import sangria.macros.derive._

  implicit private val ExampleModelType =
    deriveObjectType[Unit, ProgrammingLanguage](ObjectTypeDescription("A Programming language"))

  val QueryType = ObjectType("Query", fields[GraphQLContext, Unit](
    Field("languages", ListType(ExampleModelType),
      description = Some("Returns a list of programming languages"),
      arguments = Nil,
      resolve = c => c.ctx.getExampleData
    )
  )
  )
}