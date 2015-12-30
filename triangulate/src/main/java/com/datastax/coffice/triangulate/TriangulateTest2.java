package com.datastax.coffice.triangulate;

import scala.Tuple2;

public class TriangulateTest2 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Triangulate triangulate = new Triangulate();
		Circle c1 = new Circle(236, 67, 695.075535464);
		Circle c2 = new Circle(-268, 172, 409.498473746);
		Tuple2<Point,Point> result=triangulate.circle_intersection(c1,c2);
		Point p1 = result._1;
		Point p2 = result._2;

		System.out.println(p1.x() + ":" + p1.y());
		System.out.println(p2.x() + ":" + p2.y());

        assert(1 == 1);
	}

}
