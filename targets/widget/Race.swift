import Foundation

// 比赛时间数据类型
struct Session: Codable {
    let date: String?
    let time: String?
}

// 最快圈数据类型
struct FastLap: Codable {
    let fast_lap: String?
    let fast_lap_driver_id: String?
    let fast_lap_team_id: String?
}

// 车手数据类型
struct Driver: Codable {
    let driverId: String?
    let permanentNumber: String?
    let code: String?
    let givenName: String?
    let familyName: String?
    let name: String?
    let surname: String?
    let nationality: String?
    let dateOfBirth: String?
    let url: String?
}

// 制造商数据类型
struct Constructor: Codable {
    let constructorId: String?
    let name: String?
    let nationality: String?
}

// 赛道位置数据类型
struct CircuitLocation: Codable {
    let lat: String?
    let long: String?
    let locality: String?
    let country: String?
}

// 赛道数据类型
struct Circuit: Codable {
    let circuitId: String?
    let circuitName: String?
    let name: String?
    let country: String?
    let Location: CircuitLocation?
}

// 比赛结果数据类型
struct Result: Codable {
    let position: String?
    let points: String?
    let Driver: Driver?
    let Constructor: Constructor?
}

// 大奖赛数据类型
struct Race: Codable {
    let season: String?
    let raceId: String?
    let name: String?
    let raceName: String?
    let round: String?
    let url: String?
    let date: String?
    let time: String?
    let Circuit: Circuit?
    let FirstPractice: Session?
    let SecondPractice: Session?
    let ThirdPractice: Session?
    let Qualifying: Session?
    let Sprint: Session?
    let SprintQualifying: Session?
    let Results: [Result]?
}