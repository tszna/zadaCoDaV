Dodałem piwik-pro do swojego aktualnego projektu. Strona logowania, wraz z zgodą na przetrwarzanie danych prezentuje się tak jak na screenie.

<img src="https://i.imgur.com/TMcicPU.png">

Projekt uruchomiony przy pomocy dockera jak i lokalnie działa dokładnie w ten sam sposób:
<p><b>API:</b> http://localhost:8000</p>
<p><b>UI:</b> http://localhost:4200</p>
<p>Zostawiłem w repozytorium klucze szyfrujące w razie potrzeby.</p>

Interfejs użytkownika zawiera panel logowania, a po zalogowaniu kilka zakładek. Wszystko zostało tak zaimplementowane aby osoba bez odpowiednich uprawnień nie mogła wejść na "nieswoją" zakładkę. W takiej sytuacji wyświetla jej się komunikat o braku uprawnień. W repozytorium są już wgrane testowe dane. Listę użytkowników wraz z ich hasłami można znaleźć w katalogu DataFixtures w pliku UserFixtures.php.