const QUIZ_DATA = {
  "part1": [
    {
      "id": 1,
      "question": "Sóng cơ là:",
      "options": [
        "sự truyền chuyển động của các hạt trong không gian.",
        "những dao động cơ lan truyền trong môi trường vật chất.",
        "sự truyền quỹ đạo của các phần tử môi trường.",
        "sự dịch chuyển của vật chất theo thời gian."
      ],
      "answer": "B"
    },
    {
      "id": 2,
      "question": "Sóng dọc là sóng trong đó các phần tử của môi trường dao động theo phương:",
      "options": [
        "vuông góc với phương truyền sóng.",
        "trùng với phương truyền sóng.",
        "thẳng đứng.",
        "nằm ngang."
      ],
      "answer": "B"
    },
    {
      "id": 3,
      "question": "Sóng ngang truyền được trong các môi trường nào?",
      "options": [
        "Rắn, lỏng, khí.",
        "Chất lỏng và chất khí.",
        "Chất khí và bề mặt chất rắn.",
        "Chất rắn và bề mặt chất lỏng."
      ],
      "answer": "D"
    },
    {
      "id": 4,
      "question": "Quá trình truyền sóng cơ học thực chất là quá trình truyền:",
      "options": [
        "vật chất của môi trường.",
        "năng lượng dao động.",
        "các phần tử vật chất và năng lượng.",
        "khối lượng của môi trường."
      ],
      "answer": "B"
    },
    {
      "id": 5,
      "question": "Khi một sóng cơ truyền qua một môi trường, các phần tử của môi trường:",
      "options": [
        "chuyển động cùng với tốc độ truyền sóng.",
        "dao động xung quanh vị trí cân bằng cố định của chúng.",
        "di chuyển theo phương truyền sóng để truyền năng lượng.",
        "không dao động nếu là sóng ngang."
      ],
      "answer": "B"
    },
    {
      "id": 6,
      "question": "Vận tốc truyền sóng cơ học phụ thuộc chủ yếu vào yếu tố nào?",
      "options": [
        "Biên độ sóng.",
        "Tần số sóng.",
        "Bản chất của môi trường truyền sóng.",
        "Năng lượng sóng."
      ],
      "answer": "C"
    },
    {
      "id": 7,
      "question": "Phát biểu nào sau đây đúng khi nói về sóng âm truyền trong không khí?",
      "options": [
        "Là sóng ngang.",
        "Là sóng dọc.",
        "Là sóng điện từ.",
        "Không truyền được năng lượng."
      ],
      "answer": "B"
    },
    {
      "id": 8,
      "question": "Bước sóng λ là:",
      "options": [
        "khoảng cách giữa hai điểm gần nhất trên phương truyền sóng dao động ngược pha.",
        "quãng đường sóng truyền đi được trong một chu kì.",
        "khoảng cách giữa hai điểm bất kỳ dao động cùng pha.",
        "khoảng cách giữa một đỉnh sóng và một hõm sóng."
      ],
      "answer": "B"
    },
    {
      "id": 9,
      "question": "Công thức liên hệ giữa vận tốc truyền sóng v, bước sóng λ và chu kì T là:",
      "options": [
        "v = λ / T",
        "λ = v / T",
        "v = λ . T",
        "v = T / λ"
      ],
      "answer": "A"
    },
    {
      "id": 10,
      "question": "Khi sóng cơ truyền từ không khí vào nước, đại lượng nào sau đây không đổi?",
      "options": [
        "Vận tốc truyền sóng.",
        "Bước sóng.",
        "Tần số sóng.",
        "Năng lượng sóng."
      ],
      "answer": "C"
    },
    {
      "id": 11,
      "question": "Sự truyền năng lượng của sóng tuân theo quy luật:",
      "options": [
        "Truyền đi nguyên vẹn trong mọi môi trường.",
        "Giảm dần do ma sát và sự tỏa rộng của mặt sóng.",
        "Tăng dần khi sóng truyền càng xa nguồn.",
        "Chỉ truyền năng lượng đối với sóng dọc."
      ],
      "answer": "B"
    },
    {
      "id": 12,
      "question": "Nhận xét nào đúng về biên độ sóng của các phần tử môi trường?",
      "options": [
        "Luôn bằng biên độ của nguồn sóng trong thực tế.",
        "Bằng quãng đường phần tử dịch chuyển trong một chu kì.",
        "Là độ lệch lớn nhất của phần tử so với vị trí cân bằng.",
        "Càng xa nguồn biên độ càng lớn."
      ],
      "answer": "C"
    },
    {
      "id": 13,
      "question": "(Kỹ năng AI): Khi sử dụng AI Gemini để thiết kế giao diện (UI) mô phỏng sự lan truyền sóng, từ khóa nào sau đây thuộc cấu trúc \"Yêu cầu tương tác (Input)\" của lệnh Prompt?",
      "options": [
        "\"Vẽ đồ thị dao động hình sin màu đỏ.\"",
        "\"Tạo các thanh trượt (slider) để thay đổi Biên độ và Tần số.\"",
        "\"Dùng công thức phương trình sóng u = Acos(...)\"",
        "\"Sóng dọc có phương dao động trùng phương truyền.\""
      ],
      "answer": "B"
    },
    {
      "id": 14,
      "question": "(Kỹ năng AI): Khi nhóm học sinh ra lệnh: \"Hãy vẽ một phần tử môi trường (chấm đỏ) khi có sóng lan truyền\", AI lại lập trình cho chấm đỏ chạy dọc theo chiều dài của dây. Nhóm cần dùng kiến thức nào để \"bắt lỗi\" AI?",
      "options": [
        "Bước sóng tỉ lệ thuận với chu kì.",
        "Phần tử môi trường chỉ dao động tại chỗ, không truyền đi theo sóng.",
        "Năng lượng sóng giảm dần theo thời gian.",
        "Vận tốc truyền sóng phụ thuộc môi trường."
      ],
      "answer": "B"
    },
    {
      "id": 15,
      "question": "(Kỹ năng AI): Để ép AI mô phỏng chính xác sự khác biệt về quỹ đạo của phần tử vật chất trong sóng ngang, câu lệnh Prompt cần có điều kiện ràng buộc nào?",
      "options": [
        "\"Lập trình quỹ đạo phần tử vuông góc với phương truyền sóng.\"",
        "\"Lập trình quỹ đạo phần tử chuyển động tròn đều.\"",
        "\"Lập trình quỹ đạo phần tử trùng với phương truyền sóng.\"",
        "\"Lập trình cho phần tử dịch chuyển tịnh tiến.\""
      ],
      "answer": "A"
    },
    {
      "id": 16,
      "question": "(Kỹ năng AI): Khi viết mã HTML/JS cho mô phỏng sóng, nhóm HS muốn thêm một nút bấm để \"đóng băng\" hình ảnh sóng, giúp dễ dàng đếm số lượng gợn sóng. Tính năng này trong câu lệnh Prompt được gọi là gì?",
      "options": [
        "Nút Reset / Restart.",
        "Nút Play / Pause.",
        "Nút Zoom in / Zoom out.",
        "Thanh trượt Volume."
      ],
      "answer": "B"
    },
    {
      "id": 17,
      "question": "Đại lượng nào sau đây đặc trưng cho độ cao của gợn sóng (đối với sóng nước)?",
      "options": [
        "Tần số sóng.",
        "Bước sóng.",
        "Vận tốc truyền sóng.",
        "Biên độ sóng."
      ],
      "answer": "D"
    },
    {
      "id": 18,
      "question": "Tại sao ta không thể nghe được âm thanh ngoài vũ trụ?",
      "options": [
        "Vì ngoài vũ trụ quá lạnh.",
        "Vì môi trường ngoài vũ trụ là chân không, không có phần tử vật chất để truyền sóng.",
        "Vì lực hấp dẫn ngoài vũ trụ quá yếu.",
        "Vì sóng âm bị sao băng cản lại."
      ],
      "answer": "B"
    }
  ],
  "part2": [
    {
      "id": 1,
      "question": "Một sóng cơ học truyền trên mặt nước với tần số 50Hz. Biết khoảng cách giữa 5 gợn lồi liên tiếp là 1,6m.",
      "subQuestions": [
        { "text": "a) Bước sóng của sóng trên mặt nước là 0,4m.", "answer": false },
        { "text": "b) Chu kì dao động của phần tử nước là 0,02s.", "answer": true },
        { "text": "c) Vận tốc truyền sóng trên mặt nước là 20m/s.", "answer": true },
        { "text": "d) Quá trình truyền sóng này đã mang các phân tử nước đi xa với vận tốc 20m/s.", "answer": false }
      ]
    },
    {
      "id": 2,
      "question": "Khi đánh giá một đoạn code mô phỏng \"Sự truyền năng lượng của sóng cơ\" do AI sinh ra, một nhóm học sinh nhận thấy biên độ sóng ở cuối màn hình lớn hơn biên độ ở vị trí nguồn phát.",
      "subQuestions": [
        { "text": "a) Hiện tượng AI mô phỏng như trên là hoàn toàn đúng với thực tế.", "answer": false },
        { "text": "b) Học sinh cần viết lệnh (Prompt): \"Hãy bổ sung hệ số tắt dần để biên độ giảm khi ra xa nguồn, do năng lượng bị tiêu hao\" để sửa lỗi AI.", "answer": true },
        { "text": "c) Sóng càng truyền ra xa, năng lượng của mỗi phần tử môi trường nhận được càng nhỏ.", "answer": true },
        { "text": "d) Tần số của sóng cũng sẽ bị giảm dần khi truyền ra xa nguồn giống như biên độ.", "answer": false }
      ]
    },
    {
      "id": 3,
      "question": "So sánh đặc điểm của sóng ngang và sóng dọc:",
      "subQuestions": [
        { "text": "a) Cả sóng ngang và sóng dọc đều là quá trình truyền trạng thái dao động.", "answer": true },
        { "text": "b) Sóng truyền trên một sợi dây đàn hồi nằm ngang luôn là sóng dọc.", "answer": false },
        { "text": "c) Âm thanh do dây thanh quản con người phát ra truyền trong không khí là sóng ngang.", "answer": false },
        { "text": "d) Sóng dọc có thể truyền được qua các lớp đất đá sâu bên trong lòng đất (chất rắn).", "answer": true }
      ]
    },
    {
      "id": 4,
      "question": "Khi sử dụng AI Gemini để thiết lập Website thí nghiệm ảo (Project STEM) về sóng cơ:",
      "subQuestions": [
        { "text": "a) Việc sử dụng ngôn ngữ tự nhiên, không cần quy luật Vật lí vẫn có thể khiến AI viết được mô phỏng chuẩn xác 100%.", "answer": false },
        { "text": "b) Cấu trúc Prompt tốt bắt buộc phải có sự mô tả hiện tượng Vật lí và đưa các công thức (VD: v = λ/T) vào để làm cơ sở cho thuật toán.", "answer": true },
        { "text": "c) Thao tác \"Debug\" (Sửa lỗi AI) đòi hỏi học sinh phải dùng kiến thức Vật lí để phản biện lại thuật toán sai của máy tính.", "answer": true },
        { "text": "d) Trên không gian Canvas của AI, học sinh không thể tinh chỉnh được màu sắc hay kích thước của hệ vân sóng sau khi đã sinh ra đoạn code ban đầu.", "answer": false }
      ]
    }
  ],
  "part3": [
    {
      "id": 1,
      "question": "Một người quan sát một chiếc phao trên mặt biển, thấy nó nhô lên cao 10 lần trong khoảng thời gian 18s. Tính chu kì dao động của sóng biển. (Kết quả tính theo đơn vị giây (s) và làm tròn đến hàng phần mười).",
      "answer": "2,0"
    },
    {
      "id": 2,
      "question": "Một sóng cơ có tần số 50Hz truyền trong một môi trường với tốc độ 20m/s. Tính bước sóng của sóng cơ này. (Kết quả tính theo đơn vị mét (m) và làm tròn đến hàng phần mười).",
      "answer": "0,4"
    },
    {
      "id": 3,
      "question": "(Kỹ năng AI): Trong đoạn mã nguồn (code) do AI sinh ra để mô phỏng sự lan truyền sóng cơ, hàm xác định hướng dao động của phần tử môi trường có chứa biến số angle (thể hiện góc lệch giữa phương dao động của phần tử và phương truyền sóng). Để màn hình hiển thị đúng hình ảnh của sóng dọc, học sinh cần yêu cầu AI gán cho biến angle giá trị bằng bao nhiêu? (Kết quả tính theo đơn vị độ (°) và lấy phần nguyên).",
      "answer": "0"
    },
    {
      "id": 4,
      "question": "Một sóng ngang truyền trên một sợi dây cao su rất dài với biên độ 5cm. Xét một phần tử vật chất A trên dây, tại thời điểm t = 0, phần tử A đang ở đỉnh sóng (li độ cực đại). Chọn chiều dương của trục tọa độ hướng lên trên. Xác định li độ của phần tử A ở thời điểm t = 0,5T (với T là chu kì sóng). (Kết quả tính theo đơn vị centimet (cm) và làm tròn đến số nguyên).",
      "answer": "-5"
    },
    {
      "id": 5,
      "question": "Một nguồn sóng dao động với tần số 10Hz. Xét hai điểm M và N trên cùng một phương truyền sóng cách nhau 12cm luôn dao động ngược pha nhau. Biết tốc độ truyền sóng trong môi trường này nằm trong khoảng từ 0,7m/s đến 1m/s. Tính tốc độ truyền sóng chính xác. (Kết quả tính theo đơn vị m/s và làm tròn đến hàng phần mười).",
      "answer": "0,8"
    },
    {
      "id": 6,
      "question": "(Kỹ năng AI): Để mô phỏng sự phụ thuộc của năng lượng sóng vào biên độ, nhóm học sinh ra lệnh cho AI thiết lập một thanh trượt chỉnh Biên độ A và một biểu đồ hiển thị Năng lượng E. Trong thuật toán, hàm năng lượng được học sinh gán bằng công thức E = k.A^x (với k là một hằng số). Dựa vào kiến thức Vật lí, học sinh cần gán cho số mũ x giá trị bằng bao nhiêu để phần mềm chạy đúng định luật? (Kết quả là một số nguyên).",
      "answer": "2"
    }
  ]
};
const STUDENT_DATA = {
  "11A1": [
    { "id": "11A1_1", "name": "Hồ Hoàng Anh", "password": "22/08/2009" },
    { "id": "11A1_2", "name": "Hồ Thị Phương Anh", "password": "03/09/2009" },
    { "id": "11A1_3", "name": "Lê Đình Anh", "password": "09/10/2009" },
    { "id": "11A1_4", "name": "Lê Phan Tuấn Anh", "password": "07/05/2009" },
    { "id": "11A1_5", "name": "Nguyễn Hoàng Anh", "password": "15/03/2009" },
    { "id": "11A1_6", "name": "Nguyễn Mỹ Quỳnh Anh", "password": "13/03/2009" },
    { "id": "11A1_7", "name": "Nguyễn Công Cần", "password": "20/01/2009" },
    { "id": "11A1_8", "name": "Trịnh Lê Nam Chiểu", "password": "20/10/2009" },
    { "id": "11A1_9", "name": "Chu Quốc Công", "password": "24/11/2009" },
    { "id": "11A1_10", "name": "Nguyễn Đức Dũng", "password": "03/04/2009" },
    { "id": "11A1_11", "name": "Nguyễn Đăng Tùng Dương", "password": "28/04/2009" },
    { "id": "11A1_12", "name": "Nguyễn Thành Đạt", "password": "25/08/2009" },
    { "id": "11A1_13", "name": "Trình Văn Đạt", "password": "07/09/2009" },
    { "id": "11A1_14", "name": "Phạm Mạnh Hà", "password": "26/12/2009" },
    { "id": "11A1_15", "name": "Phạm Thị Khánh Hà", "password": "16/11/2009" },
    { "id": "11A1_16", "name": "Đặng Quốc Hán", "password": "18/06/2009" },
    { "id": "11A1_17", "name": "Trần Võ Hoàng Hiệp", "password": "19/02/2009" },
    { "id": "11A1_18", "name": "Nguyễn Trung Hiếu", "password": "30/10/2009" },
    { "id": "11A1_19", "name": "Nguyễn Nhất Huy", "password": "25/12/2009" },
    { "id": "11A1_20", "name": "Chu Quốc Hưng", "password": "24/11/2009" },
    { "id": "11A1_21", "name": "Đậu Việt Hưng", "password": "20/08/2009" },
    { "id": "11A1_22", "name": "Ngô Thụy Khanh", "password": "17/05/2009" },
    { "id": "11A1_23", "name": "Nguyễn Duy Khánh", "password": "10/04/2009" },
    { "id": "11A1_24", "name": "Nguyễn Văn Kiên", "password": "01/01/2009" },
    { "id": "11A1_25", "name": "Nguyễn Yến Lê", "password": "24/08/2009" },
    { "id": "11A1_26", "name": "Vỗ Cát Linh", "password": "22/08/2009" },
    { "id": "11A1_27", "name": "Nguyễn Thảo My", "password": "12/11/2009" },
    { "id": "11A1_28", "name": "Nguyễn Thị Thảo My", "password": "04/03/2009" },
    { "id": "11A1_29", "name": "Hồ Quỳnh Nga", "password": "22/11/2009" },
    { "id": "11A1_30", "name": "Nguyễn Thái Nguyên", "password": "31/08/2009" },
    { "id": "11A1_31", "name": "Nguyễn Thị Quỳnh Như", "password": "17/03/2009" },
    { "id": "11A1_32", "name": "Lê Đình Phong", "password": "20/03/2009" },
    { "id": "11A1_33", "name": "Trần Hữu Phong", "password": "31/03/2009" },
    { "id": "11A1_34", "name": "Nguyễn Gia Phú", "password": "17/07/2009" },
    { "id": "11A1_35", "name": "Lưu Minh Phương", "password": "29/06/2009" },
    { "id": "11A1_36", "name": "Hồ Đức Duy Quang", "password": "18/09/2009" },
    { "id": "11A1_37", "name": "Hồ Bảo Quân", "password": "02/01/2009" },
    { "id": "11A1_38", "name": "Lê Đình Quân", "password": "06/10/2009" },
    { "id": "11A1_39", "name": "Lê Văn Tiến Quốc", "password": "02/01/2009" },
    { "id": "11A1_40", "name": "Lê Thị Thúy Quyên", "password": "08/01/2009" },
    { "id": "11A1_41", "name": "Nguyễn Thị Quyên", "password": "01/06/2009" },
    { "id": "11A1_42", "name": "Trần Thị Như Quỳnh", "password": "27/05/2009" },
    { "id": "11A1_43", "name": "Hồ Thị Tâm", "password": "29/09/2009" },
    { "id": "11A1_44", "name": "Nguyễn Quang Thành", "password": "12/04/2009" },
    { "id": "11A1_45", "name": "Phan Văn Thế", "password": "12/10/2009" },
    { "id": "11A1_46", "name": "Nguyễn Hữu Thọ", "password": "02/01/2009" },
    { "id": "11A1_47", "name": "Trương Thị Anh Thư", "password": "19/10/2009" },
    { "id": "11A1_48", "name": "Võ Thị Phương Trà", "password": "29/06/2009" },
    { "id": "11A1_49", "name": "Hồ Quỳnh Trang", "password": "20/03/2009" },
    { "id": "11A1_50", "name": "Lê Thị Huyền Trang", "password": "18/11/2009" },
    { "id": "11A1_51", "name": "Đàm Nguyễn Hà Vân", "password": "27/11/2009" },
    { "id": "11A1_52", "name": "Đào Thị Tường Vy", "password": "26/12/2009" },
    { "id": "11A1_53", "name": "Hồ Thị Hà Vy", "password": "21/08/2009" }
  ],
  "11A5": [
    { "id": "11A5_1", "name": "Hoàng Thế Bảo", "password": "26/08/2009" },
    { "id": "11A5_2", "name": "Nguyễn Đình Gia Bảo", "password": "24/10/2009" },
    { "id": "11A5_3", "name": "Đặng Trọng Chính", "password": "20/03/2009" },
    { "id": "11A5_4", "name": "Lô Ngọc Công", "password": "13/01/2008" },
    { "id": "11A5_5", "name": "Đặng Lê Anh Cường", "password": "09/09/2009" },
    { "id": "11A5_6", "name": "Lê Thị Thùy Dung", "password": "07/09/2009" },
    { "id": "11A5_7", "name": "Đàm Văn Dũng", "password": "24/07/2009" },
    { "id": "11A5_8", "name": "Lê Hoàng Khánh Duy", "password": "21/10/2009" },
    { "id": "11A5_9", "name": "Lê Văn Duy", "password": "02/06/2009" },
    { "id": "11A5_10", "name": "Nguyễn Văn Duy", "password": "20/09/2009" },
    { "id": "11A5_11", "name": "Trương Đắc Đông", "password": "29/12/2009" },
    { "id": "11A5_12", "name": "Hoàng Đình Hải", "password": "05/06/2009" },
    { "id": "11A5_13", "name": "Hoàng Văn Hảo", "password": "01/02/2009" },
    { "id": "11A5_14", "name": "Nguyễn Đức Hiệp", "password": "16/09/2009" },
    { "id": "11A5_15", "name": "Hồ Văn Hiếu", "password": "09/09/2009" },
    { "id": "11A5_16", "name": "Vũ Minh Hiếu", "password": "15/11/2009" },
    { "id": "11A5_17", "name": "Nguyễn Thị Hoa", "password": "01/07/2009" },
    { "id": "11A5_18", "name": "Lê Xuân Hoàn", "password": "22/07/2009" },
    { "id": "11A5_19", "name": "Lê Sỹ Hoàng", "password": "20/09/2009" },
    { "id": "11A5_20", "name": "Nguyễn Văn Quốc Hùng", "password": "13/03/2009" },
    { "id": "11A5_21", "name": "Hồ Hữu Huy", "password": "28/02/2009" },
    { "id": "11A5_22", "name": "Nguyễn Văn Huy", "password": "07/11/2009" },
    { "id": "11A5_23", "name": "Hồ Thị Huyền", "password": "18/10/2009" },
    { "id": "11A5_24", "name": "Trần Thị Thu Huyền", "password": "01/02/2009" },
    { "id": "11A5_25", "name": "Vũ Duy Tuấn Hưng", "password": "05/08/2009" },
    { "id": "11A5_26", "name": "Phan Văn Khải", "password": "07/09/2009" },
    { "id": "11A5_27", "name": "Đặng Lê Anh Kiên", "password": "09/09/2009" },
    { "id": "11A5_28", "name": "Đinh Trọng Kỳ", "password": "14/05/2009" },
    { "id": "11A5_29", "name": "Vũ Đức Linh", "password": "14/06/2009" },
    { "id": "11A5_30", "name": "Đàm Thị Trúc Mai", "password": "08/05/2009" },
    { "id": "11A5_31", "name": "Bùi Duy Nam", "password": "23/01/2009" },
    { "id": "11A5_32", "name": "Nguyễn Hoàng Nam", "password": "03/08/2009" },
    { "id": "11A5_33", "name": "Nguyễn Đình Ngọc", "password": "12/04/2009" },
    { "id": "11A5_34", "name": "Phan Thị Trà Nguyên", "password": "05/04/2009" },
    { "id": "11A5_35", "name": "Phạm Ngọc Nhi", "password": "05/12/2009" },
    { "id": "11A5_36", "name": "Trần Việt Phi", "password": "30/06/2009" },
    { "id": "11A5_37", "name": "Nguyễn Doãn Phú", "password": "03/03/2009" },
    { "id": "11A5_38", "name": "Đinh Hữu Quang", "password": "19/06/2009" },
    { "id": "11A5_39", "name": "Trần Văn Quân", "password": "15/07/2009" },
    { "id": "11A5_40", "name": "Đinh Văn Quỳnh", "password": "30/10/2009" },
    { "id": "11A5_41", "name": "Bùi Ngọc Tài", "password": "27/02/2008" },
    { "id": "11A5_42", "name": "Lê Đức Thắng", "password": "16/10/2009" },
    { "id": "11A5_43", "name": "Nguyễn Đình Thế", "password": "15/10/2009" },
    { "id": "11A5_44", "name": "Hồ Hữu Thịnh", "password": "18/10/2009" },
    { "id": "11A5_45", "name": "Trần Văn Thuận", "password": "25/12/2009" },
    { "id": "11A5_46", "name": "Nguyễn Thành Tố", "password": "20/08/2009" },
    { "id": "11A5_47", "name": "Vũ Thị Quỳnh Trang", "password": "12/11/2009" },
    { "id": "11A5_48", "name": "Vũ Từ Bảo Trâm", "password": "10/10/2009" },
    { "id": "11A5_49", "name": "Hoàng Trung", "password": "22/03/2009" },
    { "id": "11A5_50", "name": "Ngô Trí Trung", "password": "14/11/2009" },
    { "id": "11A5_51", "name": "Lê Văn Tuấn", "password": "27/03/2009" },
    { "id": "11A5_52", "name": "Hồ Thị Thu Uyên", "password": "03/12/2009" },
    { "id": "11A5_53", "name": "Lê Thị Thu Uyên", "password": "11/02/2009" },
    { "id": "11A5_54", "name": "Nguyễn Thị Phương Vy", "password": "04/03/2009" },
    { "id": "11A5_55", "name": "Đặng Lê Tường Vy", "password": "17/12/2009" },
    { "id": "11A5_56", "name": "Trần Lê Hà Vy", "password": "26/04/2009" },
    { "id": "11A5_57", "name": "Lương Đình Xoan", "password": "02/09/2009" }
  ]
};
