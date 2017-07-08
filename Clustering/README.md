Source: [Bureau of Labor Statistics](http://www.bls.gov/lau/#tables), [Census Bureau](https://github.com/topojson/us-atlas)

This choropleth shows unemployment rates as of August, 2016 with a [threshold scale](https://github.com/d3/d3-scale/blob/master/README.md#scaleThreshold). I employed a mix of command-line tools to transform the fixed-width text file into a CSV, including [dsv2dsv](https://github.com/d3/d3-dsv/blob/master/README.md#dsv2dsv):

```
cat <(echo "id,rate") \
  <(tail -n +7 laucntycur14.txt \
    | grep 'Aug-16' \
    | cut -b 21-22,28-30,129-133 \
    | tr -s ' ' \
    | dsv2dsv -r ' ') \
  | csv2tsv \
  > unemployment.tsv
```
