import sbt._
import Keys._
import play.sbt.PlayImport._

object PlayWebpackExampleProject {

  def defaultSettings: Seq[Setting[_]] = Seq(
    organization := "com.bowlingx",
    scalaVersion := "2.12.1",
    scalacOptions ++= Seq("-unchecked", "-deprecation", "-feature", "-language:implicitConversions"),
    libraryDependencies ++= Seq(
      ws,
      guice,
      filters,
      "com.bowlingx" %% "play-webpack" % "0.1.11",
      "org.scalatestplus.play" %% "scalatestplus-play" % "3.0.0-RC1" % Test,
      "org.sangria-graphql" %% "sangria" % "1.2.1",
      "org.sangria-graphql" %% "sangria-play-json" % "1.0.2"
    )
  )
}
