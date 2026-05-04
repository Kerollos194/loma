const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../images');

const mapping = {
  "imgi_1_AB6AXuAU_MiuWjsYbmlNjgg6Ix5aVu0BZY2G3AiM7qBfUS2k9fbfPWR9vL-_4yEFIML0pV7SAkkLgm1nwr09vm9QCd7Y8yw5iYo0gjBVlNGRJPvX_fcOEJnzNA_H-t-eA2S7s_1fT0WBOywDuQC7HX7HX_oLSBNHdhVr3orCe-U11N.png": "returned_meal_1.png",
  "imgi_2_AB6AXuAPEaIL-dSHH_pXjUM929THlhWaPtWGsuReXyouCqsIDNXkub_0-Kofia5WLMZm3hfO76fucldx2bPr4IDtgGTs8VIZ9yO49BaJ0pFBNwVhrVR1feJwr4fWSHww0VR2niJxpHjtFqY4SKgiubgqV3byphzABePXmRq_4PdRL4.png": "returned_meal_2.png",
  "imgi_3_AB6AXuCkLAHHtVcmGGBOwdHu68PzHdmELyTwJOxKX3S2Kg4GkRFidbm2dnbsFdhnDdgxuoD_HE-HkkrLwXKtX31NquqNU7j-ASLFKgY93J6y583A6T32_5UbmN7_3yZbLEW3JHrfl1G_ANAionEBX-HnWWrTQMqU-IcLV7ASMOuOaq.png": "returned_meal_3.png",
  "imgi_4_AB6AXuBSM4ZEUmYD7Xi-FwE1gskjFAjh7xiffUIPmG5RxHE8Vi9v-RlB8ErQ0eEV1NnnhtMO8Vyn1k8DfnFm61USwqx2rjKIvzUCEWG9M6USCwanEYV35oO7e_jxZVn7VX-7EQ-1c7cItsuFsPFy_EcpVnDeSVadvHPgiVUsRkWuQv.png": "returned_meal_4.png",
  "imgi_5_AB6AXuCEPWDxJHkwMe8za-eezKhbxyphtDjK0V3xp-r9DOtyB4tM4A6T3WcmBvKJDsVLoyuAi5Ph6y3FmfaTInBQ376wsd4AirFT5LgQXwZQhwzXBAxkeZE5lGZuJB-Ol3eczwrEOov2iWJQW3atLIZhn2LhD_fvO9hVP7JscYj5uW.png": "returned_meal_5.png",
  "imgi_1_AB6AXuCi7Imi3IneVNPkQ8t3FwyKVgCsFLSgs8rJ_HT3wehtZ4Pv6iD5nYoGCvTpywGIfh3__fOHBXmpiyPaSBUoFa3c4AGQ8bJa9C10qx_Wn0eJMo2H34VhCItJPCXy8ntN32D5rWOxqtY8-0lrpnXV9HCZIQ1vv07bQeudXkZ.png": "returned_meal_6.png",
  "imgi_3_AB6AXuD0il-N3IiqzaS8QsbKDcGn9OiPIqOTRUYrxEc5O6FmUK4L3YrkzOL1Fv7xuydDM01943ksSyOsPUk6zdwGNwNXUpqTTHhhM1Wxct1u0sd2Bk2Y2ZNi8dkh1NWLi0lWuL_IZDYUsgQgJerdYYzbud5mwHGDMSBG1SYcKBKSzkWKH.jpeg": "fresh_meal_1.jpeg",
  "imgi_4_AB6AXuBKDSWfE3cVO6oxyUB123UBOpRpqhxz1PhWqtLf0rfsxwo0dVsyhOUtfPCSpR5A2ApmtBbgUrSmKIgfb2NP8jeNhFsQfok8hnj_BmNKRq4T_6PMt7dvoEdh7MSaxLSP--bYMoQ09hgx2oh7j5tNO-rdbNTcGR5hhbMNrkPteueuo.jpeg": "fresh_meal_2.jpeg",
  "imgi_5_AB6AXuBxderPSFKTPmSA29_WlrO8V-cBc37M604eCUyBiIJVc-jsJMLMPgsynSNp2s-asZiQPDOibJzbHk1YS6HRA9Ad9semqbdSAQYN8wno99DaBZq1qH2Rz1d2LiVbC7WH0lUo0IVzjyf6uj4SFqFoPpcsLEka274mzaO7Rz77oPphv.jpeg": "fresh_meal_3.jpeg",
  "imgi_6_AB6AXuC-Xpgksn55dJT0U8lit-f8qPo4CFD9ehMxBYdTRyG6kjxt-dK25kiEosW8WElMFZVfUPhWFQ0yXHd_JINB8LAdzuCynRab7YwbtAP4-w-WlFmgS8UBoZoRmbSF-NWvXHFJvGFw8aA3f2uzxyeYYdftRZQ52sqGcVCD5q5mitgUo.jpeg": "fresh_meal_4.jpeg",
  "imgi_7_AB6AXuAe1v3E7Q4Pk2cnLJN4ba1uEfMAfXNFVPoLnpgxV_WV98btAqhogOSOPI-LCLIDnOswXH7LD2YKRv6PqO19Ff2psvUDazWWmCA3ffVFq98voJEypF_S9ySClLzpf-6m1hOyVAFbJ293dIYSj19D8-qQDEPxKHOIiekcSC7N2azNX.jpeg": "fresh_meal_5.jpeg",
  "imgi_8_AB6AXuBtXb1ByMcn4wRvk6gPVPqSAR8Vvp5yVtkJ6vg7zxi8KtOcZoCpBdwpwjFEmX23G56ov7MVSybqIfaDtAlivvkFNpqm3EODSpdN62gQ8l_TM7Xq2t6YWrH0zsxBTBb4eKX8wfHzy7YMNfVib174iv6a3PEnwg22C18oNiz2iIFon.jpeg": "fresh_meal_6.jpeg",
  "photo-1498837167922-ddd27525d352.avif": "food_concept.avif"
};

for (const [oldName, newName] of Object.entries(mapping)) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${newName}`);
  } else {
    console.log(`Not found: ${oldName.substring(0, 20)}...`);
  }
}
