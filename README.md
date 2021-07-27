## Stemhub City

An Extension for Stemhub Smart City and Smart Home

## Code Example
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

## Supported targets
for PXT/microbit

## License
MIT
