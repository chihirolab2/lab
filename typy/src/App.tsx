import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CompatScreen } from './screens/CompatScreen';
import { CompleteScreen } from './screens/CompleteScreen';
import { DiagnosisIntroScreen, QuestionScreen } from './screens/DiagnosisScreens';
import { FriendsScreen } from './screens/FriendsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MyPageScreen } from './screens/MyPageScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TypeDetailScreen } from './screens/TypeDetailScreen';
import { ZukanScreen } from './screens/ZukanScreen';
import { AppStoreProvider } from './store/AppStore';

export default function App() {
  return (
    <AppStoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomeScreen />} />
            <Route path="diagnosis" element={<DiagnosisIntroScreen />} />
            <Route path="diagnosis/play" element={<QuestionScreen />} />
            <Route path="result" element={<ResultScreen />} />
            <Route path="zukan" element={<ZukanScreen />} />
            <Route path="type/:code" element={<TypeDetailScreen />} />
            <Route path="compat" element={<CompatScreen />} />
            <Route path="friends" element={<FriendsScreen />} />
            <Route path="mypage" element={<MyPageScreen />} />
            <Route path="complete" element={<CompleteScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStoreProvider>
  );
}
