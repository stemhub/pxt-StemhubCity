## Stemhub City

An Extension for Stemhub Smart City and Smart Home

![icon](https://github.com/stemhub/pxt-StemhubCity/blob/master/icon.png)

## Code Example

Control traffic light

```JavaScript
basic.forever(function () {
    stemhubCity.traffic_light_control(true, false, false)
    basic.pause(2000)
    stemhubCity.traffic_light_control(false, true, false)
    basic.pause(2000)
    stemhubCity.traffic_light_control(false, false, true)
    basic.pause(2000)
})
```
Turn on white LED when motion detected

```JavaScript
basic.forever(function () {
    if (stemhubCity.read_motion_sensor(AnalogPin.P0)) {
        stemhubCity.turn_white_led(1023, AnalogPin.P2)
        basic.pause(1000)
        stemhubCity.turn_white_led(0, AnalogPin.P2)
    }
})
```

## Supported targets
for PXT/microbit

## License
MIT
