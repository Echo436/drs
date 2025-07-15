import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: configuration)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let entry = SimpleEntry(date: Date(), configuration: configuration)
        // 设置每6小时刷新一次小组件
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 6, to: Date())!
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
}

struct widgetEntryView : View {
    var entry: Provider.Entry

    func getCurrentRace() -> Race? {
//        let defaults = UserDefaults(suiteName: "group.com.keee.drs")
//        guard let jsonString = defaults?.string(forKey: "currentRace"),
//              !jsonString.isEmpty else {
//            return nil
//        }
      
        let jsonString = "{\"season\":\"2025\",\"round\":\"6\",\"url\":\"https://en.wikipedia.org/wiki/2025_Miami_Grand_Prix\",\"raceName\":\"Miami Grand Prix\",\"Circuit\":{\"circuitId\":\"miami\",\"url\":\"https://en.wikipedia.org/wiki/Miami_International_Autodrome\",\"circuitName\":\"Miami International Autodrome\",\"Location\":{\"lat\":\"25.9581\",\"long\":\"-80.2389\",\"locality\":\"Miami\",\"country\":\"USA\"}},\"date\":\"2025-05-04\",\"time\":\"20:00:00Z\",\"FirstPractice\":{\"date\":\"2025-05-02\",\"time\":\"16:30:00Z\"},\"Qualifying\":{\"date\":\"2025-05-03\",\"time\":\"20:00:00Z\"},\"Sprint\":{\"date\":\"2025-05-03\",\"time\":\"16:00:00Z\"},\"SprintQualifying\":{\"date\":\"2025-05-02\",\"time\":\"20:30:00Z\"},\"Results\":[]}"
        
        do {
            let decoder = JSONDecoder()
            let race = try decoder.decode(Race.self, from: Data(jsonString.utf8))
            return race
        } catch {
            print("Error decoding Race data: \(error)")
            return nil
        }
    }

    func test() -> String {
        let defaults = UserDefaults(suiteName: "group.com.keee.drs")
        return defaults?.string(forKey: "hello") ?? "No data found"
    }
    
    var body: some View {
        VStack {
//            Text(test())
        }
        if let race = getCurrentRace() {
            VStack(alignment: .leading, spacing: 8) {
                Text(race.raceName ?? "未知比赛")
                    .font(.headline)
                    .fontWeight(.bold)
                
                if let circuit = race.Circuit {
                    Text(circuit.circuitName ?? "")
                        .font(.subheadline)
                }
                
                if let date = race.date, let time = race.time {
                    Text("\(date) \(time)")
                        .font(.caption)
                }
                
                if let round = race.round {
                    Text("第\(round)站")
                        .font(.caption2)
                }
            }
//            .padding()
        } else {
            VStack {
                Text("DRS")
                Text("暂无比赛数据")
            }
        }
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

extension ConfigurationAppIntent {
    fileprivate static var preview: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        return intent
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(date: .now, configuration: .preview)
}
