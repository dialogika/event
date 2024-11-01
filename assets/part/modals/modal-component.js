class FooterModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <!-- Modal HTML content -->
        <div class="modal fade overflow-hidden" id="footerSubModal" tabindex="-1" aria-hidden="true" aria-labelledby="footerSubModal">
          <div class="modal-dialog modal-fullscreen-md-down popup-box-dialog modal-dialog-centered modal-content position-relative overflow-hidden">
            <div class="d-flex flex-shrink-0 align-items-center justify-content-between position-relative overflow-hidden" style="height: 200px;">
              <div class="w-100">
                <img src="assets/img/footer-header-2.webp" alt="Bergabung dengan Komunitas Kami" class="w-auto h-auto object-fit-contain">
              </div>
            </div>
            <div class="modal-body w-100 h-auto">
              <form>
                <!-- Modal form fields -->
                <div class="mb-3 input-sub-footer-wrapper">
                  <label class="form-label" for="inputSubFooterNama">Nama</label>
                  <input type="text" placeholder="Masukkan nama" id="inputSubFooterNama" name="inputSubFooterNama" />
                </div>
                <div class="mb-3 input-sub-footer-wrapper">
                  <label class="form-label" for="inputSubFooterWhatsapp">Whatsapp</label>
                  <input type="tel" id="inputSubFooterWhatsapp" name="inputSubFooterWhatsapp" />
                </div>
                <div class="mb-3 input-sub-footer-wrapper">
                  <label class="form-label" for="inputSubFooterEmail">Email</label>
                  <input type="text" placeholder="johndoe@gmail.com" id="inputSubFooterEmail" name="inputSubFooterEmail" />
                </div>
                <div class="mb-3 input-sub-footer-wrapper">
                  <label class="form-label" for="inputSubFooterDomisili">Kota/Kabupaten</label>
                  <input type="text" placeholder="Jakarta" id="inputSubFooterDomisili" name="inputSubFooterDomisili" />
                </div>
              </form>
            </div>
            <div class="modal-footer w-100 py-2">
              <button style="border-radius:10px;" class="yellow-dialogika-btn" data-bs-toggle="modal" data-bs-target="#footerSubModal">Close</button>
              <button style="border-radius:10px;" class="blue-dialogika-btn" id="subFooterBtn">Kirim & Gabung group</button>
            </div>
          </div>
        </div>
      `;
  }
}

customElements.define("footer-modal", FooterModal);
