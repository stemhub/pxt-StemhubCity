//% weight=100 color=#058f05 icon="\uf1ad" block="Stemhub:City"
namespace stemhubCity {
    let pin_R = DigitalPin.P0
    let pin_Y = DigitalPin.P1
    let pin_G = DigitalPin.P2
    
    /**
     * Set traffic light pins
     * @param R_pin Red pin, eg: DigitalPin.P0
     * @param Y_pin Yellow pin, eg: DigitalPin.P1
     * @param G_pin Green pin, eg: DigitalPin.P2
     */
    //%subcategory=SmartCity
    //% blockId=traffic_light_setting
    //% block="Traffic light pin setting |Red $R_pin Yellow $Y_pin Green $G_pin"
    //% weight=251
    export function traffic_light_setting(R_pin: DigitalPin,Y_pin: DigitalPin,G_pin: DigitalPin): void {
        pin_R=R_pin
        pin_Y=Y_pin
        pin_G=G_pin
        basic.pause(500)
    }

    //%subcategory=SmartCity
    //% blockId=traffic_light_control
    //% block="Control traffic light |Red $out_red Yellow $out_yellow Green $out_green"
    //% out_red.shadow="toggleOnOff"
    //% out_yellow.shadow="toggleOnOff"
    //% out_green.shadow="toggleOnOff"
    //% weight=250
    export function traffic_light_control(out_red: boolean, out_yellow: boolean, out_green: boolean): void {
        let red=out_red?1:0
        let yellow=out_yellow?1:0
        let green=out_green?1:0
        pins.digitalWritePin(pin_R, red)
        pins.digitalWritePin(pin_Y, yellow)
        pins.digitalWritePin(pin_G, green)
        basic.pause(500)
    }

    //%subcategory=SmartCity
    //%blockId=turn_white_led
    //%block="Turn White LED to %intensity |at %pin"
    //% weight=245
    //% intensity.min=0 intensity.max=1023
    export function turn_white_led(intensity: number, pin: AnalogPin): void {
        pins.analogWritePin(pin, intensity)
        basic.pause(500)
    }

    //%subcategory=SmartCity
    //%blockId=servo
    //%block="Turn Servo to %deg degree |at %pin"
    //% weight=240
    //% deg.min=0 deg.max=180
    export function servo(deg: number, pin: AnalogPin): void {
        pins.servoWritePin(pin, deg)
        basic.pause(500)
    }

    //% blockId=read_light_sensor
    //% block="Get light value (percentage) at Pin %light_pin"
    //% weight=225
    export function read_light_sensor(light_pin: AnalogPin): number {
        return Math.round(pins.analogReadPin(light_pin)/1023*100)
    }

    //% blockId=read_raindrop_sensor
    //% block="Get raindrop value (percentage) at Pin %rain_pin"
    //% weight=200
    export function read_raindrop_sensor(rain_pin: AnalogPin): number {
        return Math.round(pins.analogReadPin(rain_pin)/1023*100)
    }

    //% blockId=read_motion_sensor
    //% block="Get motion (triggered or not) at Pin %motion_pin"
    //% weight=180
    export function read_motion_sensor(motion_pin: AnalogPin): boolean {
        if (pins.analogReadPin(motion_pin) > 800)
			return true
		else return false
    }

    //% blockId=read_sound_sensors
    //% block="Get noise level (dB) at Pin %sound_pin"
    //% weight=170
    export function read_sound_sensor(sound_pin: AnalogPin): number {
        let sum=0;
        for(let i=0;i<20;i++){
		let temp = pins.map(Math.abs(pins.analogReadPin(sound_pin) - 520),0,520,0,1023);
		temp =temp/1023*100
        sum=sum+temp;
        }
        return sum/20
    }

    export enum DistanceUnit {
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches,
	 //% block="μs"
    MicroSeconds
	}

    //% blockId=read_distance_sensor
	//% block="Get distance unit %unit trig %trig echo %echo"
	//% weight=140
	//% trig.defl=DigitalPin.P14 echo.defl=DigitalPin.P15
	//% inlineInputMode=inline
    export function read_distance_sensor(unit: DistanceUnit, trig: DigitalPin, echo: DigitalPin, maxCmDistance = 500): number {
        // send pulse
        let d=10;
        pins.setPull(trig, PinPullMode.PullNone);
        for (let x=0; x<10; x++)
        {
            pins.digitalWritePin(trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);
            // read pulse
            d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
            if (d>0)
                break;
        }

        switch (unit) {
            case DistanceUnit.Centimeters: 
                if (control.ramSize()<20000){
                    return Math.round(d/58*1.4);}
                else{
                    return Math.round(d/58);}
            case DistanceUnit.Inches: 
                if(control.ramSize()<20000){
                    return Math.round(d/148*1.4);}
                else{
                    return Math.round(d/148);}
            default: return d ;
        }
    }

    let _firsttime=true
    let _temperature: number = -999.0
    let _humidity: number = -999.0
    let _readSuccessful: boolean = false
	let _sensorresponding: boolean = false

    export enum DHT11dataType {
    //% block="temperature"
    temperature,
	//% block="humidity"
    humidity
	}
    function dht11_queryData( dataPin: DigitalPin) {

        if(_firsttime){
            _firsttime=false
            dht11_queryData(dataPin)
        }
        //initialize
        let startTime: number = 0
        let endTime: number = 0
        let checksum: number = 0
        let checksumTmp: number = 0
        let dataArray: boolean[] = []
        let resultArray: number[] = []
        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)
        _humidity = -999.0
        _temperature = -999.0
        _readSuccessful = false
        _sensorresponding = false
        startTime = input.runningTimeMicros()

        //request data
        pins.digitalWritePin(dataPin, 0) //begin protocol
        basic.pause(18)
        pins.setPull(dataPin, PinPullMode.PullUp) //pull up data pin if needed
        pins.digitalReadPin(dataPin)
        control.waitMicros(40)
        if (pins.digitalReadPin(dataPin) == 1) {
            //if no respone,exit the loop to avoid Infinity loop
            pins.setPull(dataPin, PinPullMode.PullNone) //release pull up
        }
        else{
        pins.setPull(dataPin, PinPullMode.PullNone) //release pull up
        while (pins.digitalReadPin(dataPin) == 0); //sensor response
        while (pins.digitalReadPin(dataPin) == 1); //sensor response

        //read data (5 bytes)
        for (let index = 0; index < 40; index++) {
            while (pins.digitalReadPin(dataPin) == 1);
            while (pins.digitalReadPin(dataPin) == 0);
            control.waitMicros(28)
            //if sensor pull up data pin for more than 28 us it means 1, otherwise 0
            if (pins.digitalReadPin(dataPin) == 1) dataArray[index] = true
        }

        endTime = input.runningTimeMicros()

        //convert byte number array to integer
        for (let index = 0; index < 5; index++)
            for (let index2 = 0; index2 < 8; index2++)
                if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)

        //verify checksum
        checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        checksum = resultArray[4]
        if (checksumTmp >= 512) checksumTmp -= 512
        if (checksumTmp >= 256) checksumTmp -= 256
        if (checksum == checksumTmp) _readSuccessful = true

        //read data if checksum ok
        if (_readSuccessful) {
            
                //DHT11
                _humidity = resultArray[0] + resultArray[1] / 100
                _temperature = resultArray[2] + resultArray[3] / 100
            
        }
        
       
        //wait 1 sec after query 
        basic.pause(1000)

        }
    }

    //% block="DHT11 Read %dht11data| at pin %dht11pin|"
	//% weight=150
    export function readData(dht11data: DHT11dataType, dht11pin: DigitalPin): number {
		// querydata
		dht11_queryData(dht11pin)
		//return temperature /humidity
		if(dht11data == DHT11dataType.temperature && _readSuccessful)
			return Math.round (_temperature)
		else if(dht11data == DHT11dataType.humidity && _readSuccessful)
			return Math.round (_humidity)
		else return 0
    }
}
