#!/usr/bin/perl
#
# Eric Jiang
# http://notes.ericjiang.com/posts/54
# This software is public domain.
#
use bytes;
 
my $data;
 
#prevents us from repeating messages
my $waitingflag = 0;
 
while (1) {
 
    $data = `cat /dev/$ARGV[0] | head -c 7`;
 
    my $report = ord(substr($data, 0, 1));
    my $status = ord(substr($data, 1, 1));
    my $unit   = ord(substr($data, 2, 1));
    my $exp    = ord(substr($data, 3, 1));
    my $lsb    = ord(substr($data, 4, 1));
    my $msb    = ord(substr($data, 5, 1));
    my $weight = ($msb * 256 + $lsb) / 10;
    if($exp != 255 && $exp != 0) {
        $weight ^= $exp;
    }
    #print "$report $status $unit $exp $weight\n";
 
    if($report != 0x03) {
      die "Error reading scale data!\n";
    }
 
    if($status == 0x01) {
      die "Scale reports FAULT!\n";
    } elsif ($status == 0x02 && $weight == 0) {
        if($waitingflag != 0x02) {
	    print "$weight";
	    last;
        }
    } elsif ($status == 0x03) {
        if($waitingflag != 0x03) {
            print "Weighing...\n";
            $waitingflag = 0x03;
        }
    } elsif ($status == 0x04) {
        my $unitName = "units";
        if($unit == 11) {
            $unitName = "ounces";
        } elsif ($unit == 12) {
            $unitName = "pounds";
        } elsif ($unit == 2) {
	    $unitName = "grams";
	    $weight = $weight * 10;
	}
        print "$weight";
	last;
    } elsif ($status == 0x05) {
        if($waitingflag != 0x05) {
       	    print "-25\n";
	    last;
        }
    } elsif ($status == 0x06) {
        if($waitingflag != 0x06) {
            print "Scale reports Over Weight!\n";
            $waitingflag = 0x06;
        }
    } elsif ($status == 0x07) {
        if($waitingflag != 0x07) {
            print "Scale reports Calibration Needed!\n";
            $waitingflag = 0x07;
        }
    } elsif ($status == 0x08) {
        if($waitingflag != 0x08) {
            print "Scale reports Re-zeroing Needed!\n";
            $waitingflag = 0x08;
        }
    } else {
        die "Unknown status code: $status\n";
    }
 
}
