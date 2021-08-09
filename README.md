## Stemhub City

An Extension for Stemhub Smart City and Smart Home.

Stemhub City is an educational kit for students to understand the concept of how smart city and smart home works.
Teacher can teach students how to use sensors (human sensor, raindrop sensor, motion sensor) with micro:bit to build intelligent city.

![icon](https://github.com/stemhub/pxt-StemhubCity/blob/master/icon.png)

## Code Examples

Turning Servo

```JavaScript
stemhubCity.servo(90, AnalogPin.P0)
```

Read sound sensor

```JavaScript
let sound = stemhubCity.read_sound_sensor(AnalogPin.P0)
```

Control traffic light

```JavaScript
let trafficLight = stemhubCity.traffic_light_setting(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2)
basic.forever(function () {
    trafficLight.traffic_light_control(true, false, false)
    basic.pause(1000)
    trafficLight.traffic_light_control(false, true, false)
    basic.pause(1000)
    trafficLight.traffic_light_control(false, false, true)
    basic.pause(1000)
})
```

Control color led

```JavaScript
let colorLED = stemhubCity.color_led_setting(AnalogPin.P0, AnalogPin.P1, AnalogPin.P2)
colorLED.color_led_control(1023, 500, 0)
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

Read Ultrasonic

```JavaScript
let distance = stemhubCity.read_distance_sensor(stemhubCity.DistanceUnit.Centimeters, DigitalPin.P15, DigitalPin.P16)
```

Turn on fan if keypad key "1" is pressed

```JavaScript
basic.forever(function () {
    if (stemhubCity.readKeyPad(DigitalPin.P0, DigitalPin.P1) == "1") {
        stemhubCity.FanControl(stemhubCity.FanState.On, DigitalPin.P14, DigitalPin.P15)
    }
})
```

Use OLED screen to display string

```JavaScript
stemhubCity.OLED.init(128, 64)
basic.forever(function () {
    stemhubCity.OLED.writeStringNewLine("hi")
    basic.pause(500)
    stemhubCity.OLED.writeStringNewLine(":)")
    basic.pause(500)
    stemhubCity.OLED.clear()
})
```

## Supported targets
for PXT/microbit

## License
MIT
