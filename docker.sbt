// docker:

packageName in Docker := "bowlingx/play-webpack-example"

maintainer in Docker := "David Heidrich <me@bowlingx.com>"

dockerBaseImage := "bowlingx/java-base"

javaOptions in Universal ++= Seq(
  "-Dpidfile.path=/dev/null"
)

dockerExposedPorts := Seq(9000)
