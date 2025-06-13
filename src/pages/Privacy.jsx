import React from "react";
import "./privacy.css";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <Navbar />
      <div className="container">
        <h1 className="privacy-title">Gizlilik Politikası</h1>

        <p>
          MatchMaster olarak kullanıcı gizliliğini son derece önemsiyoruz. Bu Gizlilik Politikası, web sitemizi kullanırken sizinle ilgili topladığımız bilgilerin nasıl işlendiğini ve korunduğunu açıklar.
        </p>

        <h2>1. Tahminlerin Paylaşımı</h2>
        <p>
          Sitemiz üzerinden kullanıcıya sunulan maç tahminleri ve analiz içerikleri yalnızca bireysel kullanım içindir. Herhangi bir kullanıcı, bu içerikleri ekran görüntüsü, kopyalama, yeniden paylaşma veya üçüncü şahıslara dağıtma yoluyla paylaşamaz. 
          Bu kurala uymayan kullanıcılar, abonelik durumu, admin yetkisi ya da herhangi bir ayrıcalığına bakılmaksızın sistemden kalıcı olarak uzaklaştırılabilir.
        </p>

        <h2>2. Verilerin Korunması</h2>
        <p>
          Sitemizdeki istatistikler, tahmin motorları, yapay zeka algoritmaları ve kullanıcı davranışlarına dayalı analizler MatchMaster'a aittir. Bu verilerin dışarıya çıkarılması, izinsiz şekilde paylaşılması veya herhangi bir biçimde kopyalanması suç teşkil eder.
          Bu tarz ihlallerde, kullanıcıya yasal yaptırım uygulanabilir.
        </p>

        <h2>3. Ekran Görüntüsü ve Dış Paylaşım Yasağı</h2>
        <p>
          Platform içeriğinin ekran görüntüsü alınarak sosyal medya, forumlar veya başka platformlarda paylaşılması kesinlikle yasaktır. Bu gibi durumların tespiti halinde, kullanıcı süresiz olarak yasaklanacak ve gerekli durumlarda yasal işlem başlatılacaktır.
        </p>

        <h2>4. Abonelik ve Yetki İstisnası Yoktur</h2>
        <p>
          MatchMaster sisteminde bulunan hiç kimse – aboneler, editörler, adminler ya da diğer yetkililer – yukarıda belirtilen gizlilik kurallarını ihlal etme hakkına sahip değildir. Herkes bu gizlilik politikası ile yükümlüdür.
        </p>

        <h2>5. Yasal Sorumluluk</h2>
        <p>
          MatchMaster, kullanıcıların gizlilik kurallarını ihlal etmesi halinde doğabilecek zararlardan dolayı sorumluluk kabul etmez. Her kullanıcı, bu sayfada belirtilen gizlilik politikasını kabul etmiş sayılır ve sorumluluğu kendisine aittir.
        </p>

        <h2>6. Politika Güncellemeleri</h2>
        <p>
          Gizlilik politikamız zaman zaman güncellenebilir. Değişiklikler bu sayfa üzerinden yayımlanacak olup, tüm kullanıcıların düzenli olarak kontrol etmesi beklenir.
        </p>

        <p className="last-note">
          Sorularınız veya endişeleriniz varsa lütfen bizimle <a href="/contact">iletişime geçin</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;