name := "triangulate"

organization := "com.datastax.coffice.positioning"

version := "0.0.1"

scalaVersion := "2.11.1"

libraryDependencies += "junit" % "junit" % "4.11"

javacOptions ++= Seq("-source", "1.7", "-target", "1.7")

scalacOptions in (Compile, doc) ++= Seq("-doc-root-content", "rootdoc.txt")

EclipseKeys.withBundledScalaContainers := false

// Enable assertions
fork in run := true

javaOptions in run += "-ea"
