import math
import random
import pylab

from sympy import symbols, Eq, solve

random.seed(1337)
MAX_RANGE = 1000

COLORS = 'b,g,r,c,m,y,k'.split(',')
STYLE = '-,--,-.,:,.,o,v,^,<,>,1,2,3,4,s,p,*,h,H,+,x,D,d,|,_'.split(',')


class Generator:
    def generate_random_points(self, width):
        """
        Generate random (x,y) coordinates to test with
        """
        return (random.randint(-1 * width, width),
                random.randint(-1 * width, width))


def graph(array_of_points):
    """
    Graph points and display in a matplotlib chart
    """

    for x, y, style in array_of_points:
        if style:
            pylab.plot(x, y, style)
        else:
            pylab.plot(x, y)
    pylab.show()

def readings(array_of_points):
    """
    Create fake API data in the form (x,y,rssi)
    Note MAX_RANGE-fu may not be true rssi, we'll see in practice later
    """
    device = array_of_points[-1]
    sensors = array_of_points[:-1]

    readings = []
    for i, sensor in enumerate(sensors):
        hypot = (MAX_RANGE - math.hypot(sensor[0] - device[0], sensor[1] - device[1])) / MAX_RANGE
        if hypot < 0:
            hypot = 0
        readings.append([sensor[0], sensor[1], hypot])

    return readings

def find_point(a, b, a_b, ra, rb):
    """
    trilateration code should go here:
    https://en.wikipedia.org/wiki/Trilateration

    Currently thinking of finding 3 intersection points and then averaging them out
    """
    print 'a:', a
    print 'b:', b
    print 'a_b:', a_b
    print 'ra:', ra
    print 'rb:', rb

    x, y = symbols('x y')
    ax, ay, bx, by = symbols('ax ay bx by')
    expression1 = Eq((x - a[0])**2 + (y - a[1])**2, ra**2)
    expression2 = Eq((x - b[0])**2 + (y - b[1])**2, rb**2)

    print expression1
    print expression2

    intersections = solve([expression1, expression2], [x, y])
    print 'intersections:', intersections

    style = STYLE[random.randint(0, len(STYLE) - 1)]
    print 'style:', style
    for i, intersection in enumerate(intersections):
        plot_points.append([intersection[0],
                         intersection[1],
                         '%s%s' % (COLORS[i],
                                   style)])

def triangulate(sensor_readings):
    """
    Loop over fake API sensor readings to build variables to be used for trilateration
    """
    for i, reading_a in enumerate(sensor_readings):
        reading_b = sensor_readings[(i + 1) % len(sensor_readings)]

        a = {'x': reading_a[0],
             'y': reading_a[1],
             'rssi': reading_a[2],
             'scaled_distance': 1.0 - reading_a[2]}
        b = {'x': reading_b[0],
             'y': reading_b[1],
             'rssi': reading_b[2],
             'scaled_distance': 1.0 - reading_b[2]}

        a_b = {'length': math.hypot(b['x'] - a['x'], b['y'] - a['y'])}
        a_b['rssi'] = (MAX_RANGE - a_b['length']) / MAX_RANGE
        a_b['rssi'] = a_b['rssi'] if a_b['rssi'] > 0 else 0
        a_b['scaled_distance'] = 1.0 - a_b['rssi']

        ra = {'possible_length': (a_b['length'] / a_b['scaled_distance']) * a['scaled_distance']}
        rb = {'possible_length': (a_b['length'] / a_b['scaled_distance']) * b['scaled_distance']}

        find_point(a=(a['x'], a['y']),
                   b=(b['x'], b['y']),
                   a_b=a_b['length'],
                   ra=ra['possible_length'],
                   rb=rb['possible_length'])

        print 'a:', a
        print 'b:', b
        print 'a_b:', a_b
        print 'ra:', ra
        print 'rb:', rb
        print

    return [0, 0, '*c']

generator = Generator()
plot_points = []
def main():
    for i in range(3):
        x, y = generator.generate_random_points(width=1000)

        # possibly use this?
        # cens,edg,tri,neig = triang.delaunay(x,y)

        plot_points.append([x, y, 'bo'])

    device_x, device_y = generator.generate_random_points(width=1000)
    plot_points.append([device_x, device_y, 'Dr'])
    print 'Generated device location: (%s, %s)' % (device_x, device_y)
    print

    sensor_readings = readings(plot_points)

    found_point = triangulate(sensor_readings)

    plot_points.append(found_point)

    graph(plot_points)

if __name__ == '__main__':
    main()
