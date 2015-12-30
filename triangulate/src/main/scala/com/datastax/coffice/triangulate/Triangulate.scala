package com.datastax.coffice.triangulate

import java.lang.Math.sqrt

object Triangulate extends App {
  val triangulate = new Triangulate()
  triangulate.run_test(new Circle(-1.0, -1.0, 1.5), new Circle(1.0, 1.0, 2.0))
  triangulate.run_test(new Circle(236, 67, 695.075535464), new Circle(-268, 172, 409.498473746))
}

class Circle(val x: Double, val y: Double, val r: Double)
class Point(val x: Double, val y: Double)

class Triangulate {

  def run_test(a: Circle, b: Circle) {
    val (loc1, loc2) = circle_intersection(a, b)
    printf("\nax=%f, ay=%f, ra=%f, bx=%f, by=%f, rb=%f :\n", a.x, a.y, a.r, b.x, b.y, b.r)
    printf(" x3=%f, y3=%f, x3_prime=%f, y3_prime=%f\n", loc1.x, loc1.y, loc2.x, loc2.y)
  }

  def circle_intersection(a: Circle, b: Circle): (Point, Point) = {
    val distance: Double = java.lang.Math.hypot(b.x - a.x, b.y - a.y)
    val a2 = (a.r * a.r - b.r * b.r + distance * distance) / (2 * distance)
    val x2 = a.x + ((b.x - a.x) * a2 / distance)
    val y2 = a.y + ((b.y - a.y) * a2 / distance)
    val h = sqrt((a.r * a.r) - (a2 * a2))
    val rx = -(b.y - a.y) * (h / distance)
    val ry = (b.x - a.x) * (h / distance)
    val xi = x2 + rx; val xi_prime = x2 - rx
    val yi = y2 + ry; val yi_prime = y2 - ry
    return (new Point(xi, yi), new Point(xi_prime, yi_prime))
  }
}