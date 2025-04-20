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
        let defaults = UserDefaults(suiteName: "group.com.keee.drs")
        guard let jsonString = defaults?.string(forKey: "currentRace"),
              !jsonString.isEmpty else {
            return nil
        }
        
        do {
            let decoder = JSONDecoder()
            let race = try decoder.decode(Race.self, from: Data(jsonString.utf8))
            return race
        } catch {
            print("Error decoding Race data: \(error)")
            return nil
        }
    }
    
    var body: some View {
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
            .padding()
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
