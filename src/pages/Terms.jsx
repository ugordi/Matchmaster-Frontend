import React from "react";
import "./terms.css";
import Navbar from "../components/Navbar";

const TermsOfUse = () => {
  return (
    <div className="terms-page">
      <Navbar />
      <div className="terms-container">
        <h1 className="terms-title">Kullanım Şartları</h1>

        <p>
          Bu Kullanım Şartları, MatchMaster platformunu kullanan tüm kullanıcılar için geçerlidir. Platformu kullanarak, aşağıda yer alan tüm kuralları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. 
          Kullanım koşullarına uymamanız durumunda, üyeliğiniz askıya alınabilir veya kalıcı olarak sona erdirilebilir.
        </p>

        <h2>1. Hizmetin Tanımı</h2>
        <p>
          MatchMaster, futbol maçlarına dair tahminler sunan, yapay zeka temelli bir analiz platformudur. Sistemimiz geçmiş maç istatistiklerini, takım profillerini, bahis oranlarını ve çeşitli parametreleri analiz ederek tahminler üretmektedir. Ayrıca, haftalık quiz sistemi ile kullanıcıların futbol bilgilerini test etmelerine ve puan toplamalarına olanak tanır.
        </p>

        <h2>2. Kullanıcı Sorumlulukları</h2>
        <p>
          - Her kullanıcı, kendisine özel kullanıcı hesabı üzerinden giriş yaparak hizmetten faydalanır. 
          - Kullanıcı hesabının gizliliği ve güvenliği kullanıcının sorumluluğundadır. 
          - Kullanıcılar, tahminleri yalnızca kişisel kullanım için alabilir; kopyalama, yayma veya üçüncü kişilerle paylaşma hakkına sahip değildir.
          - Sahte hesaplar oluşturmak, sistemi manipüle etmek veya başka kullanıcıların deneyimini bozmak yasaktır.
        </p>

        <h2>3. Tahmin Sistemi ve Yapay Zeka</h2>
        <p>
          MatchMaster tahmin motoru, geçmiş verilere dayalı olarak sonuçlar üretir. Bu tahminler %100 doğruluk garantisi taşımaz. Kullanıcılar bu tahminleri bilgilendirme amacıyla kullanmalı, yatırım veya bahis kararlarını kendi sorumluluklarında almalıdır.
        </p>

        <h2>4. Quiz Sistemi ve Puanlama</h2>
        <p>
          Platform haftalık olarak düzenlenen quiz soruları sunar. Her kullanıcı, haftalık quiz'e yalnızca bir kez katılabilir. Doğru cevaplar belirli bir puan kazandırır ve kullanıcılar ay bazlı ve sezon bazlı sıralamalarda yer alırlar.
          Tahmin başarıları da puan sistemine katkı sağlar. Hiçbir kullanıcı geçmişte cevapladığı bir soruya tekrar erişemez.
        </p>

        <h2>5. Yasaklı Eylemler</h2>
        <p>
          Aşağıdaki eylemler kesinlikle yasaktır:
          <ul>
            <li>Tahminlerin veya quiz içeriklerinin dışarıya aktarılması veya sosyal medyada paylaşılması</li>
            <li>Platform içeriğinin ekran görüntüsünün alınarak dağıtılması</li>
            <li>Yapay zeka sisteminin analiz çıktılarının izinsiz şekilde kullanılması</li>
            <li>Spam, dolandırıcılık veya sistem açıklarından yararlanma girişimi</li>
          </ul>
          Bu gibi durumlar tespit edildiğinde, kullanıcı hesabı derhal askıya alınır ve yasal işlem başlatılır.
        </p>

        <h2>6. Üyelik ve Abonelik</h2>
        <p>
          MatchMaster hizmetlerinden tam faydalanabilmek için kullanıcıların ücretsiz ya da ücretli bir üyelik başlatmaları gereklidir. Ücretli üyeliklerde sunulan ayrıcalıklar MatchMaster tarafından belirlenir ve zaman zaman değiştirilebilir.
          Abonelik ödemeleri iade edilmez. Kurallara aykırı davranışta abonelik iptal edilebilir.
        </p>

        <h2>7. Hizmet Değişikliği ve Güncellemeler</h2>
        <p>
          MatchMaster, sunulan hizmetlerde ve bu kullanım şartlarında önceden bildirimde bulunmaksızın değişiklik yapma hakkını saklı tutar. Tüm kullanıcılar bu sayfayı düzenli olarak kontrol etmekle yükümlüdür.
        </p>

        <h2>8. Yasal Geçerlilik ve Yetki</h2>
        <p>
          Kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir ihtilaf durumunda Ankara Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>

        <p className="last-note">
          Her türlü soru ve görüş için <a href="/contact">iletişime geçebilirsiniz</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;