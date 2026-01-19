
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
// Note: You would need to add 'font_awesome_flutter' and 'percent_indicator' to pubspec.yaml
// import 'package:percent_indicator/linear_percent_indicator.dart';

void main() {
  runApp(const UpscRankersApp());
}

class UpscRankersApp extends StatelessWidget {
  const UpscRankersApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'UPSC Rankers',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.orange,
          primary: const Color(0xFFEA580C), // orange-600
        ),
        fontFamily: 'Inter',
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;
  final List<String> _completedTopics = [];

  void _onCompleteTopic(String id) {
    setState(() {
      if (!_completedTopics.contains(id)) _completedTopics.add(id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      HomeScreen(completedTopics: _completedTopics, onComplete: _onCompleteTopic),
      const CommunityScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        selectedItemColor: const Color(0xFFEA580C),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(FontAwesomeIcons.house), label: 'Learn'),
          BottomNavigationBarItem(icon: Icon(FontAwesomeIcons.users), label: 'Rankers'),
          BottomNavigationBarItem(icon: Icon(FontAwesomeIcons.user), label: 'Profile'),
        ],
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  final List<String> completedTopics;
  final Function(String) onComplete;

  const HomeScreen({super.key, required this.completedTopics, required this.onComplete});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Focus Studio', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [IconButton(icon: const Icon(Icons.search), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('KNOWLEDGE ROADMAP', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2, color: Colors.grey)),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            children: [
              _buildSubjectCard('Polity', FontAwesomeIcons.gavel, Colors.blue, 2, 5),
              _buildSubjectCard('History', FontAwesomeIcons.landmark, Colors.amber, 1, 4),
              _buildSubjectCard('Geography', FontAwesomeIcons.earthAsia, Colors.emerald, 0, 3),
              _buildSubjectCard('Economy', FontAwesomeIcons.chartLine, Colors.indigo, 0, 4),
            ],
          ),
          const SizedBox(height: 24),
          const Text('TRENDING CONCEPTS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2, color: Colors.grey)),
          const SizedBox(height: 12),
          _buildTopicTile('Doctrine of Basic Structure', 'Polity', context),
          _buildTopicTile('Bhakti Movement', 'History', context),
        ],
      ),
    );
  }

  Widget _buildSubjectCard(String title, IconData icon, Color color, int completed, int total) {
    double progress = completed / total;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const Spacer(),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text('$completed/$total Mastered', style: const TextStyle(fontSize: 10, color: Colors.grey)),
          const SizedBox(height: 8),
          LinearProgressIndicator(value: progress, backgroundColor: color.withOpacity(0.1), color: color, minHeight: 4),
        ],
      ),
    );
  }

  Widget _buildTopicTile(String title, String subject, BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade100)),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subject, style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold, fontSize: 10)),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {
          // Navigate to Topic Detail
        },
      ),
    );
  }
}

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Rankers Feed', style: TextStyle(fontWeight: FontWeight.w900))),
      body: ListView.builder(
        itemCount: 5,
        padding: const EdgeInsets.all(16),
        itemBuilder: (context, index) => Card(
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(backgroundImage: NetworkImage('https://picsum.photos/100')),
                    const SizedBox(width: 12),
                    const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('Anjali Sharma', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text('RECORDING SHARED', style: TextStyle(fontSize: 8, color: Colors.grey)),
                    ])),
                    IconButton(icon: const Icon(Icons.play_circle, color: Colors.orange), onPressed: () {}),
                  ],
                ),
                const SizedBox(height: 12),
                const Text("Just mastered 'Basic Structure Doctrine'! Explaining it out loud is a game changer for memory.", style: TextStyle(fontStyle: FontStyle.italic)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircleAvatar(radius: 50, backgroundImage: NetworkImage('https://picsum.photos/200')),
            const SizedBox(height: 16),
            const Text('Master Aspirant', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const Text('Mastery Streak: 12 Days 🔥', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16)),
              onPressed: () {}, 
              child: const Text('GO PREMIUM')
            ),
          ],
        ),
      ),
    );
  }
}
