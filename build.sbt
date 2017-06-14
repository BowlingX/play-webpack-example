import PlayWebpackExampleProject._

lazy val `play-webpack-example` = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(defaultSettings)

TwirlKeys.templateImports += "com.bowlingx.webpack.WebpackManifest"

